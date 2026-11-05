const { assert } = require('chai');
const http = require('http');

// Characterization tests for the CASE, OpenBadges, SCD and xAPI adapters.
// They pin down what each endpoint returns for data created here, so that
// refactoring the adapters (declaring their functions, tightening
// regular expressions and so on) cannot silently change the output.
describe('Adapter output (characterization)', function () {
    this.timeout(60000);
    const loopback = process.env.CASS_LOOPBACK || 'http://localhost/api/';
    let repo;
    let owner;
    let framework;
    let parent;
    let child;
    let relation;

    const getText = async (path, headers) => {
        const res = await fetch(loopback + path, { headers: headers || {} });
        return { status: res.status, text: await res.text() };
    };
    const getJson = async (path) => {
        const res = await getText(path, { Accept: 'application/json' });
        assert.strictEqual(res.status, 200, path + ' -> ' + res.text);
        return JSON.parse(res.text);
    };

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));

        repo = new EcRepository();
        await repo.init(loopback);
        owner = new EcIdentity();
        owner.ppk = EcPpk.generateKey();
        owner.displayName = 'Characterization Owner';
        EcIdentityManager.default.addIdentity(owner);

        framework = new EcFramework();
        framework.generateId(repo.selectedServer);
        framework.setName('Characterization Framework');
        framework.setDescription('A framework for pinning down adapter output.');
        framework.addOwner(owner.ppk.toPk());

        parent = new EcCompetency();
        parent.generateId(repo.selectedServer);
        parent.setName('Parent Competency');
        parent.setDescription('The parent.');
        parent.addOwner(owner.ppk.toPk());

        child = new EcCompetency();
        child.generateId(repo.selectedServer);
        child.setName('Child Competency');
        child.addOwner(owner.ppk.toPk());

        relation = new EcAlignment();
        relation.generateId(repo.selectedServer);
        relation.source = child.shortId();
        relation.target = parent.shortId();
        relation.relationType = EcAlignment.NARROWS;
        relation.addOwner(owner.ppk.toPk());

        framework.addCompetency(parent.shortId());
        framework.addCompetency(child.shortId());
        framework.addRelation(relation.shortId());
        await repo.multiput([parent, child, relation, framework]);
    });

    describe('CASE export', function () {
        it('CFPackages bundles the document, its items and its associations', async () => {
            const guid = framework.getGuid();
            const pkg = await getJson('ims/case/v1p0/CFPackages/' + guid);
            const documentUri = repo.selectedServer + 'ims/case/v1p0/CFDocuments/' + guid;
            assert.deepEqual(Object.keys(pkg), ['CFDocument', 'CFItems', 'CFAssociations', 'CFDefinitions']);

            const doc = pkg.CFDocument;
            assert.strictEqual(doc['@context'], undefined);
            assert.strictEqual(doc.type, 'case:CFDocument');
            assert.strictEqual(doc.identifier, guid);
            assert.strictEqual(doc.title, 'Characterization Framework');
            assert.strictEqual(doc.description, 'A framework for pinning down adapter output.');
            assert.strictEqual(doc.uri, documentUri);
            assert.deepEqual(doc.subjectURI, []);
            assert.deepEqual(doc.CFPackageURI, {
                title: 'Characterization Framework',
                identifier: guid,
                uri: repo.selectedServer + 'ims/case/v1p0/CFPackages/' + guid
            });

            const documentRef = { uri: documentUri, title: 'Characterization Framework', identifier: guid };
            const items = {};
            for (const item of pkg.CFItems) items[item.identifier] = item;
            assert.sameMembers(Object.keys(items), [parent.getGuid(), child.getGuid()]);
            const p = items[parent.getGuid()];
            assert.strictEqual(p['@type'], 'case:CFItem');
            assert.strictEqual(p['@id'], parent.id);
            assert.strictEqual(p.fullStatement, 'Parent Competency');
            assert.strictEqual(p.notes, 'The parent.');
            assert.strictEqual(p.uri, repo.selectedServer + 'ims/case/v1p0/CFItems/' + parent.getGuid());
            assert.strictEqual(p.CFItemType, null);
            assert.strictEqual(p.CFItemTypeURI, null);
            assert.deepEqual(p.CFDocumentURI, documentRef);
            assert.strictEqual(items[child.getGuid()].fullStatement, 'Child Competency');
            assert.notProperty(items[child.getGuid()], 'notes');

            assert.lengthOf(pkg.CFAssociations, 1);
            const a = pkg.CFAssociations[0];
            assert.strictEqual(a.type, 'case:CFAssociation');
            assert.strictEqual(a.identifier, relation.getGuid());
            assert.strictEqual(a.id, relation.id);
            assert.strictEqual(a.relationType, 'narrows');
            assert.strictEqual(a.uri, repo.selectedServer + 'ims/case/v1p0/CFAssociations/' + relation.getGuid());
            assert.deepEqual(a.originNodeURI, {
                title: 'Child Competency',
                uri: repo.selectedServer + 'ims/case/v1p0/CFItems/' + child.getGuid(),
                identifier: child.getGuid()
            });
            assert.deepEqual(a.destinationNodeURI, {
                title: 'Parent Competency',
                uri: repo.selectedServer + 'ims/case/v1p0/CFItems/' + parent.getGuid(),
                identifier: parent.getGuid()
            });
            assert.deepEqual(a.CFDocumentURI, documentRef);
            assert.match(a.lastChangeDateTime, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/);

            assert.deepEqual(pkg.CFDefinitions, { CFConcepts: [], CFSubject: [], CFLicenses: [], CFItemTypes: [], CFAssociationGroupings: [] });
        });

        it('CFPackages for an unknown framework fails', async () => {
            const res = await getText('ims/case/v1p0/CFPackages/' + EcCrypto.generateUUID(), { Accept: 'application/json' });
            assert.notStrictEqual(res.status, 200);
        });
    });

    describe('CASE harvest', function () {
        // A minimal CASE provider, so that harvesting does not depend on a public server.
        let provider;
        let providerUrl;
        const docId = 'c0ffee00-0000-4000-8000-' + Date.now().toString().padStart(12, '0').slice(-12);
        const itemId = 'c0ffee01-0000-4000-8000-' + Date.now().toString().padStart(12, '0').slice(-12);
        const assocId = 'c0ffee02-0000-4000-8000-' + Date.now().toString().padStart(12, '0').slice(-12);
        let requests = [];

        before(async () => {
            const base = () => providerUrl + '/ims/case/v1p0/';
            const document = () => ({
                identifier: docId,
                uri: base() + 'CFDocuments/' + docId,
                title: 'Harvested Document',
                creator: 'Characterization',
                CFPackageURI: { title: 'Harvested Document', identifier: docId, uri: base() + 'CFPackages/' + docId }
            });
            provider = http.createServer((req, res) => {
                requests.push(req.url);
                let body = null;
                if (req.url === '/ims/case/v1p0/CFDocuments') body = { CFDocuments: [document()] };
                else if (req.url === '/ims/case/v1p0/CFDocuments/' + docId) body = document();
                else if (req.url === '/ims/case/v1p0/CFPackages/' + docId) body = {
                    CFDocument: document(),
                    CFItems: [{
                        identifier: itemId,
                        uri: base() + 'CFItems/' + itemId,
                        fullStatement: 'Harvested Item',
                        educationLevel: ['09'],
                        CFDocumentURI: { identifier: docId, uri: base() + 'CFDocuments/' + docId }
                    }],
                    CFAssociations: [{
                        identifier: assocId,
                        uri: base() + 'CFAssociations/' + assocId,
                        associationType: 'isChildOf',
                        originNodeURI: { identifier: itemId, uri: base() + 'CFItems/' + itemId },
                        destinationNodeURI: { identifier: docId, uri: base() + 'CFDocuments/' + docId },
                        CFDocumentURI: { identifier: docId, uri: base() + 'CFDocuments/' + docId }
                    }]
                };
                res.writeHead(body ? 200 : 404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(body || { error: 'not found' }));
            });
            await new Promise((resolve) => provider.listen(0, '127.0.0.1', resolve));
            providerUrl = 'http://127.0.0.1:' + provider.address().port;
        });

        after(() => provider && provider.close());

        it('getDocs lists the provider\'s CFDocuments', async () => {
            const res = await getText('ims/case/getDocs?url=' + encodeURIComponent(providerUrl + '/'));
            assert.strictEqual(res.status, 200, res.text);
            const docs = JSON.parse(res.text);
            assert.lengthOf(docs.CFDocuments, 1);
            assert.strictEqual(docs.CFDocuments[0].identifier, docId);
        });

        it('harvest saves the document, item and association as a framework, competency and relation', async () => {
            const form = new FormData();
            form.append('signatureSheet', await EcIdentityManager.default.signatureSheet(60000, repo.selectedServer));
            form.append('owner', owner.ppk.toPk().toPem());
            requests = [];
            const res = await fetch(loopback + 'ims/case/harvest?caseEndpoint=' + encodeURIComponent(providerUrl + '/') + '&dId=' + docId, { method: 'POST', body: form });
            assert.strictEqual(res.status, 200, await res.text());
            assert.includeMembers(requests, ['/ims/case/v1p0/CFDocuments/' + docId, '/ims/case/v1p0/CFPackages/' + docId], 'the trailing slash is trimmed from caseEndpoint');

            const caseUri = (kind, id) => providerUrl + '/ims/case/v1p0/' + kind + '/' + id;
            const f = await EcFramework.get(caseUri('CFDocuments', docId), null, null, repo);
            assert.isNotNull(f, 'framework saved under the CASE document URI');
            assert.strictEqual(f.name, 'Harvested Document');
            assert.strictEqual(f.creator, 'Characterization');
            assert.strictEqual(f['schema:identifier'], docId);
            assert.isTrue(f.hasOwner(owner.ppk.toPk()), 'the supplied owner owns the framework');
            assert.deepEqual(f.competency, [caseUri('CFItems', itemId)]);
            assert.deepEqual(f.relation, [caseUri('CFAssociations', assocId)]);

            const c = await EcCompetency.get(caseUri('CFItems', itemId), null, null, repo);
            assert.strictEqual(c['schema:name'], 'Harvested Item');
            assert.strictEqual(c['schema:identifier'], itemId);
            assert.notProperty(c, 'CFDocumentURI');
            assert.deepEqual(c['schema:educationalAlignment'], [{
                '@type': 'reference',
                '@context': 'https://schema.cassproject.org/0.4',
                'schema:alignmentType': 'educationalLevel',
                'schema:targetName': '09'
            }]);

            const r = await EcAlignment.get(caseUri('CFAssociations', assocId), null, null, repo);
            assert.strictEqual(r.relationType, EcAlignment.NARROWS);
            assert.strictEqual(r['schema:identifier'], assocId);
            assert.strictEqual(r.source, caseUri('CFItems', itemId));
            assert.strictEqual(r.target, caseUri('CFDocuments', docId));
        });
    });

    describe('OpenBadges', function () {
        let person;
        let fingerprint;

        before(async () => {
            fingerprint = owner.ppk.toPk().fingerprint();
            person = new EcPerson();
            person.assignId(repo.selectedServer, fingerprint);
            person.addOwner(owner.ppk.toPk());
            person.name = 'Badge Earner';
            person.email = 'badge.earner@example.com';
            await repo.saveTo(person);
        });

        it('/badge/pk serves the adapter\'s public key', async () => {
            const res = await getText('badge/pk');
            assert.strictEqual(res.status, 200);
            assert.match(res.text, /^-----BEGIN PUBLIC KEY-----/);
            assert.strictEqual(EcPk.fromPem(res.text).toPem(), res.text);
        });

        it('/badge/profile describes the issuer', async () => {
            const profile = await getJson('badge/profile/' + fingerprint);
            assert.deepEqual(profile, {
                '@context': 'https://w3id.org/openbadges/v2',
                id: repo.selectedServer + 'badge/profile/' + fingerprint,
                type: 'Issuer',
                name: 'Badge Earner',
                url: repo.selectedServer + 'badge/profile/' + fingerprint,
                image: 'https://api.badgr.io/public/badges/X7kb4H72TXiMoYN_kJNdEQ/image',
                email: 'badge.earner@example.com',
                publicKey: repo.selectedServer + 'badge/cryptographicKey/' + fingerprint,
                verification: { type: 'hosted' }
            });
        });

        it('/badge/cryptographicKey describes the issuer\'s key', async () => {
            const key = await getJson('badge/cryptographicKey/' + fingerprint);
            assert.strictEqual(key['@context'], 'https://w3id.org/openbadges/v2');
            assert.strictEqual(key.type, 'CryptographicKey');
            assert.strictEqual(key.id, repo.selectedServer + 'badge/cryptographicKey/' + fingerprint);
            assert.strictEqual(key.owner, repo.selectedServer + 'data/' + fingerprint);
        });

        it('/badge/profile for an unknown person fails', async () => {
            const res = await getText('badge/profile/' + EcCrypto.md5(EcCrypto.generateUUID()));
            assert.notStrictEqual(res.status, 200);
        });

        it('/badge/class describes a competency as a badge class', async () => {
            const clazz = await getJson('badge/class/' + parent.getGuid() + '/' + fingerprint);
            assert.strictEqual(clazz['@context'], 'https://w3id.org/openbadges/v2');
            assert.strictEqual(clazz.type, 'BadgeClass');
            assert.strictEqual(clazz.id, repo.selectedServer + 'badge/class/' + parent.getGuid() + '/' + fingerprint);
            assert.strictEqual(clazz.issuer, repo.selectedServer + 'badge/profile/' + fingerprint);
            assert.strictEqual(clazz.name, 'Parent Competency');
            assert.deepEqual(clazz.criteria, { type: 'Criteria', narrative: 'The parent.' });
            assert.strictEqual(clazz.alignment[0].targetUrl, parent.id);
        });
    });

    describe('xAPI', function () {
        it('/xapi/pk serves the adapter\'s public key', async () => {
            const res = await getText('xapi/pk');
            assert.strictEqual(res.status, 200);
            assert.match(res.text, /^-----BEGIN PUBLIC KEY-----/);
        });
    });

    describe('SCD export', function () {
        it('a framework lists its competencies and relations as SCD URLs', async () => {
            const scd = await getJson('scd/' + framework.getGuid());
            assert.strictEqual(scd.id, framework.id);
            assert.strictEqual(scd.name, 'Characterization Framework');
            assert.sameMembers(scd.competencyDefinition, [
                repo.selectedServer + 'scd/' + parent.getGuid(),
                repo.selectedServer + 'scd/' + child.getGuid()
            ]);
            assert.deepEqual(scd.resourceAssociation, [repo.selectedServer + 'scd/' + relation.getGuid()]);
        });

        it('a URL outside this server is identified by the MD5 of its address', async () => {
            const outside = new EcFramework();
            outside.generateId(repo.selectedServer);
            outside.setName('Framework with an outside competency');
            outside.addOwner(owner.ppk.toPk());
            outside.addCompetency('https://elsewhere.example.com/competency/42');
            outside.addRelation(relation.shortId());
            await repo.saveTo(outside);
            const scd = await getJson('scd/' + outside.getGuid());
            assert.deepEqual(scd.competencyDefinition, [repo.selectedServer + 'scd/' + EcCrypto.md5('https://elsewhere.example.com/competency/42')]);
            assert.deepEqual(scd.resourceAssociation, [repo.selectedServer + 'scd/' + relation.getGuid()]);
        });
    });

    describe('CEASN concept scheme export', function () {
        let scheme;
        const concepts = {};

        before(async () => {
            scheme = new EcConceptScheme();
            scheme.generateId(repo.selectedServer);
            scheme['dcterms:title'] = 'Characterization Scheme';
            scheme.addOwner(owner.ppk.toPk());
            const make = (name) => {
                const c = new EcConcept();
                c.generateId(repo.selectedServer);
                c['skos:prefLabel'] = name;
                c['skos:inScheme'] = scheme.shortId();
                c.addOwner(owner.ppk.toPk());
                concepts[name] = c;
                return c;
            };
            const top = make('Top');
            const middle = make('Middle');
            const bottom = make('Bottom');
            const deepest = make('Deepest');
            top['skos:topConceptOf'] = scheme.shortId();
            top['skos:narrower'] = [middle.shortId()];
            middle['skos:broader'] = [top.shortId()];
            middle['skos:narrower'] = [bottom.shortId()];
            bottom['skos:broader'] = [middle.shortId()];
            bottom['skos:narrower'] = [deepest.shortId()];
            deepest['skos:broader'] = [bottom.shortId()];
            scheme['skos:hasTopConcept'] = [top.shortId()];
            await repo.multiput([top, middle, bottom, deepest, scheme]);
        });

        it('includes every level of narrower concepts', async () => {
            const res = await getText('ceasn/' + scheme.getGuid(), { Accept: 'application/json' });
            assert.strictEqual(res.status, 200, res.text);
            const graph = JSON.parse(res.text)['@graph'];
            assert.isArray(graph);
            const labels = graph.map((o) => o['skos:prefLabel'] && (o['skos:prefLabel']['en-us'] || o['skos:prefLabel']['en'] || o['skos:prefLabel'])).filter(Boolean);
            assert.includeMembers(labels.map(String), ['Top', 'Middle', 'Bottom', 'Deepest']);
            assert.lengthOf(graph, 5, 'the scheme and its four concepts');
        });
    });

    describe('Cull endpoints', function () {
        for (const endpoint of ['util/cull', 'util/cullFast']) {
            it(`${endpoint} refuses a wrong secret`, async () => {
                const res = await getText(endpoint + '?secret=' + EcCrypto.generateUUID());
                assert.strictEqual(res.status, 401);
                assert.include(res.text, 'You must provide secret=');
            });

            it(`${endpoint} fails without a secret`, async () => {
                const res = await getText(endpoint);
                assert.strictEqual(res.status, 500);
            });
        }
    });

    describe('Module scope', function () {
        // These were assigned without a declaration, so every request shared them through the global object.
        const formerGlobals = [
            'cfError', 'cfGetFramework', 'cfGetCompetency', 'cfGetAlignment', 'cfClean', 'cfDocuments', 'cfAssociations',
            'cfAssociationGroupings', 'cfConcepts', 'cfItems', 'cfItemAssociations', 'cfItemTypes', 'cfLicenses',
            'cfPackages', 'cfRubrics', 'cfSubjects', 'result', 't',
            'stripCassNamespace', 'setDateCreated', 'getTimestamp', 'convertCFDocumentToFramework',
            'convertCFAssociationIntoRelation', 'convertCFItemIntoCompetency', 'embedCFPackageIntoFramework',
            'testSuiteCase', 'ingestCase', 'getDocuments',
            'badgeSetup', 'badgeKey', 'badgeGetPerson', 'badgeCryptographicKey', 'badgeProfile', 'badgeSubject',
            'badgeClass', 'badgeAssertion', 'openbadgeCheckId',
            'guid', 'xapiKey', 'assertionHash', 'people', 'toTurtleInternal', 'skyrepoCull', 'skyrepoCullFast'
        ];

        it('adapters, profile helpers and utilities leave nothing on the global object', () => {
            // The tests above have exercised each of these code paths.
            const leaked = formerGlobals.filter((name) => Object.prototype.hasOwnProperty.call(global, name));
            assert.deepEqual(leaked, []);
        });
    });

    describe('Turtle', function () {
        it('jsonLdToTurtle serializes JSON-LD', async () => {
            const turtle = await global.jsonLdToTurtle({
                '@context': { name: 'https://schema.org/name' },
                '@id': 'https://example.com/thing',
                name: 'A thing'
            });
            assert.strictEqual(turtle, [
                '@prefix : <#>.',
                '@prefix exa: <https://example.com/>.',
                '@prefix sch: <https://schema.org/>.',
                '',
                'exa:thing sch:name "A thing".',
                '',
                ''
            ].join('\n'));
        });
    });
});
