const { assert } = require('chai');

// The conditions coprocessor (disabled by default) labels assertions with the conditions their
// evidence meets, and drops assertions that lack a requested condition. Each condition is a concept
// whose skos:hiddenLabel is a JSONPath run over the evidence and whose skos:prefLabel names it.
describe('Profile coprocessor: conditions', function () {
    this.timeout(60000);
    const loopback = process.env.CASS_LOOPBACK || 'http://localhost/api/';
    let conditions;
    let competency;
    let passing;
    let failing;
    let unlabelled;
    let savedLog;
    let savedError;
    let savedTrace;

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));

        conditions = require('../main/server/profile/coprocessors/conditions.js');
        const repo = new EcRepository();
        await repo.init(loopback);
        const owner = new EcIdentity();
        owner.ppk = EcPpk.generateKey();
        EcIdentityManager.default.addIdentity(owner);

        const concept = (label, path) => {
            const c = new EcConcept();
            c.generateId(repo.selectedServer);
            c['skos:prefLabel'] = label;
            if (path != null) c['skos:hiddenLabel'] = path;
            c.addOwner(owner.ppk.toPk());
            return c;
        };
        passing = concept('Passing', '$.result[?(@.score >= 0.5)]');
        failing = concept('Failing', '$.result[?(@.score < 0.5)]');
        unlabelled = concept('No path', null);
        competency = new EcCompetency();
        competency.generateId(repo.selectedServer);
        competency.setName('Conditional competency');
        competency.validCondition = [passing.shortId(), failing.shortId(), unlabelled.shortId()];
        competency.addOwner(owner.ppk.toPk());
        await repo.multiput([passing, failing, unlabelled, competency]);
    });

    beforeEach(() => {
        // The coprocessor narrates to the console; keep test output readable.
        savedLog = console.log;
        savedError = console.error;
        savedTrace = console.trace;
        console.log = () => { };
        console.error = () => { };
        console.trace = () => { };
    });

    afterEach(() => {
        console.log = savedLog;
        console.error = savedError;
        console.trace = savedTrace;
    });

    const assertion = (...evidence) => ({ getEvidences: async () => evidence });
    const evidenceWith = (score) => JSON.stringify({ result: [{ score }] });
    const run = async (condition, positive, negative) => {
        const metaVertex = { positiveAssertion: positive, negativeAssertion: negative };
        const processor = { params: { condition }, g: { metaVerticies: { [competency.shortId()]: metaVertex } } };
        await conditions.processAssertions.call(processor);
        return metaVertex;
    };

    it('is disabled unless configured, and orders after the other coprocessors', () => {
        assert.isFalse(conditions.enabled);
        assert.strictEqual(conditions.name, 'Conditions');
        assert.strictEqual(conditions.order, 60);
    });

    it('labels each assertion with the conditions its evidence meets, and keeps all of them when none is requested', async () => {
        const high = assertion(evidenceWith(0.9));
        const low = assertion(evidenceWith(0.1));
        const vertex = await run(undefined, [high, low], null);
        assert.deepEqual(high.condition, ['Passing']);
        assert.deepEqual(low.condition, ['Failing']);
        assert.deepEqual(high.validCondition, competency.validCondition);
        assert.lengthOf(vertex.positiveAssertion, 2);
    });

    it('drops assertions labelled with other conditions when a condition is requested by name', async () => {
        const high = assertion(evidenceWith(0.8));
        const low = assertion(evidenceWith(0.2));
        const negHigh = assertion(evidenceWith(0.7));
        const negLow = assertion(evidenceWith(0.3));
        const vertex = await run('Passing', [high, low], [negHigh, negLow]);
        assert.deepEqual(vertex.positiveAssertion, [high]);
        assert.deepEqual(vertex.negativeAssertion, [negHigh]);
    });

    it('accepts a requested condition as the concept URL for positive assertions', async () => {
        const high = assertion(evidenceWith(0.6));
        const low = assertion(evidenceWith(0.4));
        const vertex = await run([failing.shortId()], [high, low], []);
        assert.deepEqual(vertex.positiveAssertion, [low]);
    });

    it('keeps assertions whose evidence meets no condition, and those it cannot read', async () => {
        const silent = assertion(JSON.stringify({ result: [] }));
        const garbled = assertion('not json');
        const none = { getEvidences: async () => null };
        const vertex = await run('Passing', [silent, garbled, none], [garbled]);
        assert.isUndefined(silent.condition);
        assert.isUndefined(garbled.condition);
        assert.lengthOf(vertex.positiveAssertion, 3);
        assert.lengthOf(vertex.negativeAssertion, 1);
    });

    it('leaves an assertion that already carries conditions alone', async () => {
        const labelled = assertion(evidenceWith(0.9));
        labelled.condition = ['Failing'];
        const vertex = await run('Failing', [labelled], null);
        assert.deepEqual(labelled.condition, ['Failing']);
        assert.deepEqual(vertex.positiveAssertion, [labelled]);
    });

    it('gives the same labels for evidence it has already evaluated', async () => {
        const first = assertion(evidenceWith(0.95));
        const again = assertion(evidenceWith(0.95));
        await run(undefined, [first], null);
        await run(undefined, [again], null);
        assert.deepEqual(again.condition, first.condition);
    });

    it('walks every element of a profile tree in post-processing', () => {
        const visited = [];
        const node = (name, children) => ({ name, children, get seen() { visited.push(name); return true; } });
        const tree = node('root', [node('a', [node('a1', [])]), node('b', [])]);
        assert.deepEqual(conditions.postProcessProfileEachElement(tree, {}, [], new Set()), {});
    });

    it('has no-op hooks for the stages it does not use', async () => {
        assert.isUndefined(await conditions.fetchAssertions());
        assert.isUndefined(await conditions.insertResources());
        assert.isUndefined(await conditions.postProcessStart());
        assert.isUndefined(conditions.postProcessEachVertex());
        assert.isUndefined(conditions.postProcessEachEdge());
        assert.isUndefined(conditions.postProcessEachEdgeRepeating());
        assert.isUndefined(conditions.postProcessEachVertexRepeating());
        assert.isUndefined(conditions.postProcessProfileBefore());
        assert.isUndefined(conditions.postProcessProfileAfter());
    });
});
