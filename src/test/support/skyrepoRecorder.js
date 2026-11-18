// Support for the skyRepo characterization tests. Not a test file.
//
// It runs the skyRepo endpoints against an in-memory stand-in for Elasticsearch and records
// everything observable about each call: what the endpoint returned or threw, every request it sent
// to Elasticsearch, and every event it published. A recording made before a refactoring and one
// made after it must be equal for the refactoring to be behaviour-preserving.
//
// The stand-in is only active for code running inside play(). Anything else in the process (the
// live server's background work) keeps talking to the real Elasticsearch.
const { AsyncLocalStorage } = require('node:async_hooks');
const nodePath = require('node:path');

const scope = new AsyncLocalStorage();
const skyRepoDir = nodePath.resolve(__dirname, '../../main/server/skyRepo');

const globMatch = function (pattern, name) {
    const re = new RegExp('^' + pattern.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
    return re.test(name);
};

/**
 * An in-memory Elasticsearch that implements only what skyRepo uses: single-document get, index and
 * delete (typed and typeless URLs), _bulk, _mget, _search (query_string and term queries),
 * index creation and refresh. Documents keep insertion order, so results are deterministic.
 */
class FakeElastic {
    constructor() {
        // What this search engine reports about itself. It decides how a list of indices is read.
        this.info = { version: { number: '9.5.3' } };
        this.indices = new Map();
        this.requests = [];
        // Functions (action, meta) => error object or undefined, consulted for each _bulk action.
        this.bulkFaults = [];
        // When set, the next _bulk request gets this instead of a response (and the hook is cleared).
        this.nextBulkResponse = undefined;
    }

    index(name, create) {
        if (!this.indices.has(name) && create) this.indices.set(name, new Map());
        return this.indices.get(name);
    }

    // The indices a comma-separated list names, read left to right as the engine reads it. '-name'
    // takes name back out. Elasticsearch 9 and later read it so anywhere; Elasticsearch before 9,
    // and OpenSearch, only after an expression with a wildcard, and otherwise look for an index
    // called '-name'. Naming an index that does not exist, without a wildcard, is an error.
    // (Checked against Elasticsearch 7.17, 8.19 and 9.5, and OpenSearch 2.19 and 3.10.)
    resolve(expression) {
        const openSearch = this.info?.version?.distribution == 'opensearch';
        const exclusionAnywhere = !openSearch && Number.parseInt(this.info?.version?.number) >= 9;
        const names = [...this.indices.keys()];
        const result = new Set();
        let wildcardSeen = false;
        for (const part of decodeURIComponent(expression).split(',')) {
            const exclusion = part.startsWith('-') && (exclusionAnywhere || wildcardSeen);
            const pattern = exclusion ? part.substring(1) : part;
            const wildcard = pattern.includes('*') || pattern == '_all';
            if (!wildcard && !exclusion && !this.indices.has(pattern)) {
                const reason = 'no such index [' + pattern + ']';
                throw Object.assign(new Error(reason), { notFound: { error: { type: 'index_not_found_exception', reason: reason, root_cause: [{ type: 'index_not_found_exception', reason: reason }] }, status: 404 } });
            }
            for (const name of names) {
                if (pattern == '_all' || globMatch(pattern, name)) {
                    if (exclusion) result.delete(name);
                    else result.add(name);
                }
            }
            if (wildcard) wildcardSeen = true;
        }
        return names.filter((name) => result.has(name));
    }

    write(indexName, id, source, version, external) {
        const index = this.index(indexName, true);
        const old = index.get(id);
        if (external) {
            if (old != null && old.version >= version) return { conflict: true };
        } else {
            version = old == null ? 1 : old.version + 1;
        }
        index.set(id, { source: structuredClone(source), version: version });
        return { result: old == null ? 'created' : 'updated', version: version };
    }

    hit(indexName, id) {
        const doc = this.index(indexName).get(id);
        return { _index: indexName, _id: id, _version: doc.version, _source: structuredClone(doc.source) };
    }

    // A small subset of query_string: clauses joined by OR, terms joined by AND, each term being
    // '*', field:value or field:"value". A value matches a field when it equals it or is one of its
    // words. Returns a function (id, doc) => boolean.
    matcher(query) {
        const words = (doc, field, text) => {
            doc.words ??= new Map();
            const key = field + ' ' + text;
            if (!doc.words.has(key)) doc.words.set(key, new Set(text.toLowerCase().split(/[^a-z0-9]+/)));
            return doc.words.get(key);
        };
        const parse = (t) => {
            t = t.trim();
            if (t == '*' || t == '') return { all: true };
            const colon = t.indexOf(':');
            if (colon == -1) return { anywhere: t.replaceAll('"', '') };
            const value = t.substring(colon + 1).replace(/^"|"$/g, '');
            return { field: t.substring(0, colon), value: value, word: /^[a-z0-9]+$/i.test(value) ? value.toLowerCase() : null };
        };
        const clauses = query.split(' OR ').map((clause) => clause.split(' AND ').map(parse));
        const fieldMatches = (id, doc, field, has, hasWord) => {
            if (field == '_id') return has(id);
            const actual = doc.source[field];
            if (actual == null) return false;
            return [].concat(actual).some((a) => typeof a == 'string' && (has(a) || hasWord(words(doc, field, a))));
        };
        // Long lists of field:value alternatives (lookups by id) are matched through sets.
        if (clauses.length > 8 && clauses.every((c) => c.length == 1 && c[0].field != null)) {
            const byField = new Map();
            for (const [{ field, value, word }] of clauses) {
                if (!byField.has(field)) byField.set(field, { values: new Set(), words: new Set() });
                byField.get(field).values.add(value);
                if (word != null) byField.get(field).words.add(word);
            }
            return (id, doc) => [...byField].some(([field, { values, words: wanted }]) =>
                fieldMatches(id, doc, field, (a) => values.has(a), (set) => wanted.size > 0 && [...set].some((w) => wanted.has(w))));
        }
        const term = (id, doc, t) => {
            if (t.all) return true;
            if (t.anywhere != null) return JSON.stringify(doc.source).includes(t.anywhere);
            return fieldMatches(id, doc, t.field, (a) => a == t.value, (set) => t.word != null && set.has(t.word));
        };
        return (id, doc) => clauses.some((clause) => clause.every((t) => term(id, doc, t)));
    }

    search(expression, body, q) {
        const found = [];
        let matches;
        if (body?.query?.term != null) {
            const [field, value] = Object.entries(body.query.term)[0];
            matches = (id, doc) => doc.source[field] == value;
        } else {
            matches = this.matcher(q ?? body?.query?.bool?.must?.query_string?.query ?? '*');
        }
        for (const name of this.resolve(expression)) {
            for (const [id, doc] of this.index(name)) {
                if (matches(id, doc)) found.push([name, id]);
            }
        }
        const from = body?.from ?? 0;
        const size = body?.size ?? 10;
        return { hits: { total: { value: found.length, relation: 'eq' }, hits: found.slice(from, from + size).map(([name, id]) => this.hit(name, id)) } };
    }

    bulk(ndjson) {
        const lines = ndjson.split('\n').filter((l) => l != '').map((l) => JSON.parse(l));
        const items = [];
        let errors = false;
        for (let i = 0; i < lines.length; i++) {
            const [action, meta] = Object.entries(lines[i])[0];
            const item = { _index: meta._index, _id: meta._id };
            const source = action == 'index' ? lines[++i] : null;
            const fault = this.bulkFaults.map((f) => f(action, meta)).find((f) => f != null);
            if (fault != null) {
                errors = true;
                Object.assign(item, { status: 400, error: fault });
            } else if (action == 'index') {
                const written = this.write(meta._index, meta._id, source, meta.version, meta.version_type == 'external');
                if (written.conflict) {
                    errors = true;
                    Object.assign(item, { status: 409, error: { type: 'version_conflict_engine_exception' } });
                } else {
                    Object.assign(item, { status: written.result == 'created' ? 201 : 200, result: written.result, _version: written.version });
                }
            } else {
                const existed = this.index(meta._index)?.delete(meta._id) === true;
                Object.assign(item, { status: existed ? 200 : 404, result: existed ? 'deleted' : 'not_found' });
            }
            items.push({ [action]: item });
        }
        return { errors: errors, items: items };
    }

    // Returns { status, body } the way Elasticsearch would.
    handle(method, pathAndQuery, body) {
        const question = pathAndQuery.indexOf('?');
        const path = question == -1 ? pathAndQuery : pathAndQuery.substring(0, question);
        const queryString = question == -1 ? '' : pathAndQuery.substring(question + 1);
        const query = {};
        for (const pair of queryString.split('&')) {
            if (pair == '') continue;
            const eq = pair.indexOf('=');
            query[eq == -1 ? pair : pair.substring(0, eq)] = eq == -1 ? '' : pair.substring(eq + 1);
        }
        const segments = path.split('/').filter((s) => s != '');
        const last = segments[segments.length - 1];

        if (segments.length == 1 && last == '_bulk') {
            if (this.nextBulkResponse !== undefined) {
                const scripted = this.nextBulkResponse;
                this.nextBulkResponse = undefined;
                return scripted;
            }
            return { status: 200, body: this.bulk(body) };
        }
        if (segments.length == 1 && last == '_mget') {
            return {
                status: 200,
                body: {
                    docs: body.docs.map((d) => this.index(d._index)?.has(d._id) ? { ...this.hit(d._index, d._id), found: true } : { _index: d._index, _id: d._id, found: false }),
                },
            };
        }
        if (last == '_refresh') return { status: 200, body: { _shards: {} } };
        if (last == '_search') {
            try {
                return { status: 200, body: this.search(segments.length == 1 ? '*' : segments[0], body, query.q) };
            } catch (ex) {
                if (ex.notFound == null) throw ex;
                return { status: 404, body: ex.notFound };
            }
        }
        if (segments.length == 1 && method == 'PUT') {
            if (this.indices.has(segments[0])) return { status: 400, body: { error: { type: 'resource_already_exists_exception' }, status: 400 } };
            this.index(segments[0], true);
            return { status: 200, body: { acknowledged: true, index: segments[0] } };
        }
        if (segments.length == 3) {
            // /{index}/_doc/{id}, or /{index}/{type}/{id} before Elasticsearch 7.
            const indexName = segments[0];
            const id = decodeURIComponent(segments[2]);
            const index = this.index(indexName);
            if (method == 'GET') {
                if (index == null) return { status: 404, body: { error: { type: 'index_not_found_exception' }, status: 404 } };
                if (!index.has(id)) return { status: 404, body: { _index: indexName, _id: id, found: false } };
                return { status: 200, body: { ...this.hit(indexName, id), found: true } };
            }
            if (method == 'DELETE') {
                if (index == null) return { status: 404, body: { error: { type: 'index_not_found_exception' }, status: 404 } };
                const existed = index.delete(id);
                return { status: existed ? 200 : 404, body: { _index: indexName, _id: id, result: existed ? 'deleted' : 'not_found' } };
            }
            if (method == 'POST' || method == 'PUT') {
                const external = query.version_type == 'external';
                const written = this.write(indexName, id, body, external ? Number(query.version) : null, external);
                if (written.conflict) return { status: 409, body: { error: { type: 'version_conflict_engine_exception' }, status: 409 } };
                return { status: written.result == 'created' ? 201 : 200, body: { _index: indexName, _id: id, _version: written.version, result: written.result } };
            }
        }
        throw new Error('The Elasticsearch stand-in does not implement ' + method + ' ' + pathAndQuery);
    }

    // Everything stored, for asserting on the end state.
    dump() {
        const out = {};
        for (const [name, index] of this.indices) {
            out[name] = {};
            for (const [id, doc] of index) out[name][id] = { version: doc.version, source: doc.source };
        }
        return out;
    }
}

const real = {};
const eventNames = [
    ['data', 'read'], ['data', 'write'], ['data', 'delete'], ['data', 'found'], ['data', 'any'],
    ['database', 'afterSave'],
];
const realNext = [];
let elasticInfoDescriptor;
let realElasticInfo;
let savedModules;
let savedGlobals;
let installed = false;

const record = function (store, method, url, body) {
    const path = url.startsWith(global.elasticEndpoint) ? url.substring(global.elasticEndpoint.length) : url;
    let recordedBody = body;
    if (typeof body == 'string') recordedBody = body.split('\n').filter((l) => l != '').map((l) => JSON.parse(l));
    const entry = { method: method, url: path };
    if (recordedBody !== undefined) entry.body = structuredClone(recordedBody);
    store.log.push({ elastic: entry });
    const response = store.elastic.handle(method, path, body);
    return response;
};

/**
 * Loads a private copy of the skyRepo modules, capturing the endpoints they bind, and routes
 * Elasticsearch traffic and events made inside play() to the recorder.
 * @return {object} endpoint handlers by path, e.g. endpoints['/data/*']
 */
const install = function () {
    if (installed) throw new Error('skyrepoRecorder is already installed.');
    installed = true;
    const endpoints = {};

    for (const name of ['httpGet', 'httpPost', 'httpPut', 'httpDelete']) real[name] = global[name];
    // These mirror what the levr shim's helpers return for each status.
    global.httpGet = async function (url, flag, headers) {
        const store = scope.getStore();
        if (store == null) return real.httpGet.apply(this, arguments);
        const response = record(store, 'GET', url);
        return response.body;
    };
    global.httpDelete = async function (url, headers) {
        const store = scope.getStore();
        if (store == null) return real.httpDelete.apply(this, arguments);
        return record(store, 'DELETE', url).body;
    };
    global.httpPut = async function (data, url, contentType, headers) {
        const store = scope.getStore();
        if (store == null) return real.httpPut.apply(this, arguments);
        return record(store, 'PUT', url, data).body;
    };
    global.httpPost = async function (data, url, contentType, multipart, something, something2, simple, headers) {
        const store = scope.getStore();
        if (store == null) return real.httpPost.apply(this, arguments);
        const response = record(store, 'POST', url, data);
        if (response == null) return undefined;
        if (response.status == 409) return 409;
        return response.body;
    };

    elasticInfoDescriptor = Object.getOwnPropertyDescriptor(global, 'elasticSearchInfo');
    realElasticInfo = global.elasticSearchInfo;
    Object.defineProperty(global, 'elasticSearchInfo', {
        configurable: true,
        enumerable: true,
        get: () => scope.getStore()?.info ?? realElasticInfo,
        set: (value) => { realElasticInfo = value; },
    });

    for (const [group, name] of eventNames) {
        const subject = global.events[group][name];
        realNext.push([subject, subject.next]);
        const original = subject.next;
        subject.next = function (...args) {
            const store = scope.getStore();
            if (store == null) return original.apply(this, args);
            store.log.push({ event: group + '.' + name, args: structuredClone(JSON.parse(JSON.stringify(args.map((a) => a === undefined ? null : a)))) });
        };
    }

    // A private copy of the modules: fresh module state, and the endpoint functions in hand.
    savedModules = {};
    for (const key of Object.keys(require.cache)) {
        if (key.startsWith(skyRepoDir)) {
            savedModules[key] = require.cache[key];
            delete require.cache[key];
        }
    }
    savedGlobals = {};
    for (const key of Object.keys(global)) savedGlobals[key] = global[key];
    const realBind = global.bindWebService;
    global.bindWebService = (endpoint, callback) => { endpoints[endpoint] = callback; };
    try {
        require(skyRepoDir + '.js');
    } finally {
        global.bindWebService = realBind;
    }
    return endpoints;
};

const uninstall = function () {
    if (!installed) return;
    installed = false;
    for (const name of Object.keys(real)) global[name] = real[name];
    if (elasticInfoDescriptor != null) Object.defineProperty(global, 'elasticSearchInfo', elasticInfoDescriptor);
    else delete global.elasticSearchInfo;
    if (elasticInfoDescriptor == null || 'value' in elasticInfoDescriptor) global.elasticSearchInfo = realElasticInfo;
    for (const [subject, next] of realNext) subject.next = next;
    realNext.length = 0;
    for (const key of Object.keys(require.cache)) {
        if (key.startsWith(skyRepoDir)) delete require.cache[key];
    }
    Object.assign(require.cache, savedModules);
    for (const key of Object.keys(savedGlobals)) {
        if (!['httpGet', 'httpPost', 'httpPut', 'httpDelete', 'elasticSearchInfo'].includes(key) && global[key] !== savedGlobals[key]) global[key] = savedGlobals[key];
    }
};

/**
 * Runs fn with Elasticsearch replaced by the stand-in and returns the recording.
 * @param {object} options elastic: a FakeElastic to reuse; version or info: what Elasticsearch reports about itself
 * @param {function} fn async (session) => ..., where session.call(label, f) records one endpoint call
 * @return {object} { log, elastic }
 */
const play = async function (options, fn) {
    const store = {
        elastic: options.elastic || new FakeElastic(),
        info: options.info || { version: { number: options.version || '9.5.3' } },
        log: [],
    };
    store.elastic.info = store.info;
    const session = {
        elastic: store.elastic,
        // Records the outcome of one call. Errors thrown by error() are plain objects with data and status.
        call: async function (label, f) {
            store.log.push({ call: label });
            try {
                let result = await f();
                if (typeof result == 'string') {
                    try {
                        result = { json: JSON.parse(result) };
                    } catch (e) {
                        // Not JSON; record the text as it is.
                    }
                }
                store.log.push({ returned: result === undefined ? '<undefined>' : structuredClone(JSON.parse(JSON.stringify(result ?? null))) });
            } catch (ex) {
                if (ex != null && ex.data !== undefined && 'status' in ex) store.log.push({ threw: { data: ex.data, status: ex.status } });
                else store.log.push({ threw: String(ex?.message ?? ex) });
            }
        },
    };
    await scope.run(store, () => fn(session));
    return { log: store.log, elastic: store.elastic };
};

/**
 * The `this` an endpoint is called with, as the levr shim builds it.
 * @param {object} options params, dataStreams, headers, eim, signatures (pre-verified signature sheet), method
 * @return {object}
 */
const request = function (options = {}) {
    const ctx = {
        get: (field) => ctx[field],
        put: (field, value) => { ctx[field] = value; },
        req: { headers: options.headers || {}, eim: options.eim },
        res: {},
    };
    if (options.signatures != null) ctx.signatureSheet = options.signatures.map((owner) => ({ owner: owner, '@owner': owner }));
    if (options.sanctionedReplay != null) ctx.sanctionedReplay = options.sanctionedReplay;
    const self = { ctx: ctx, params: { methodType: options.method || 'GET', urlRemainder: null, ...options.params } };
    if (options.dataStreams !== undefined) self.dataStreams = options.dataStreams;
    return self;
};

/**
 * Makes a recording comparable between runs: replaces the given strings (keys, server URLs) with
 * stable tokens, and anything that looks like "now" in milliseconds with '<now>'.
 * @param {*} value the recording
 * @param {object} tokens token by string to replace
 * @return {*}
 */
const normalize = function (value, tokens) {
    let text = JSON.stringify(value);
    // Longest first, so that a string containing another is replaced whole. PEMs appear both raw and
    // escaped inside stringified documents.
    const entries = Object.entries(tokens).sort((a, b) => b[0].length - a[0].length);
    for (const [from, to] of entries) {
        for (let needle = JSON.stringify(from).slice(1, -1), depth = 0; depth < 3; depth++) {
            text = text.split(needle).join(to);
            needle = JSON.stringify(needle).slice(1, -1);
        }
    }
    const now = Date.now();
    const scrub = (v) => {
        if (typeof v == 'number' && Math.abs(v - now) < 600000) return '<now>';
        if (typeof v == 'string') {
            return v.replace(/\b1[0-9]{12}\b/g, (m) => Math.abs(Number(m) - now) < 600000 ? '<now>' : m);
        }
        if (Array.isArray(v)) return v.map(scrub);
        if (v != null && typeof v == 'object') {
            const out = {};
            for (const [k, x] of Object.entries(v)) out[k] = scrub(x);
            return out;
        }
        return v;
    };
    return scrub(JSON.parse(text));
};

module.exports = { FakeElastic, install, uninstall, play, request, normalize };
