const { assert } = require('chai');

// CEASN collections (ceterms:Collection) in both directions, and the creation dates CaSS derives
// from version-numbered identifiers on import.
describe('CEASN collections and import dates', function () {
    this.timeout(120000);
    const loopback = process.env.CASS_LOOPBACK || 'http://localhost/api/';
    const ctdlasnContext = 'https://credreg.net/ctdlasn/schema/context/json';
    let repo;
    let owner;

    const exportGraph = async (guid) => {
        const res = await fetch(loopback + 'ceasn/' + guid, { headers: { Accept: 'application/json' } });
        const text = await res.text();
        assert.strictEqual(res.status, 200, text);
        return JSON.parse(text);
    };
    const importGraph = async (graph) => {
        const form = new FormData();
        form.append('data', JSON.stringify(graph));
        form.append('owner', owner.ppk.toPk().toPem());
        const res = await fetch(loopback + 'ctdlasn', { method: 'POST', body: form });
        const text = await res.text();
        assert.strictEqual(res.status, 200, text);
        return text;
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
        owner.displayName = 'CEASN collection owner';
        EcIdentityManager.default.addIdentity(owner);
    });

    describe('export of a collection', function () {
        let collection;
        const members = {};

        before(async () => {
            const make = (name, extra) => {
                const c = new EcCompetency();
                c.generateId(repo.selectedServer);
                c.setName(name);
                Object.assign(c, extra || {});
                c.addOwner(owner.ppk.toPk());
                members[name] = c;
                return c;
            };
            const a = make('Alpha', { description: 'First member.' });
            const b = make('Bravo');
            const c = make('Charlie');
            const d = make('', { description: 'Delta, named only by its description.' });
            const outside = make('Outside');
            const inFramework = make('In a framework too');

            // A competency that also belongs to an ordinary framework is not exported as a collection member.
            const framework = new EcFramework();
            framework.generateId(repo.selectedServer);
            framework.setName('Ordinary framework');
            framework.addOwner(owner.ppk.toPk());
            framework.addCompetency(inFramework.shortId());

            const relation = (source, target, type) => {
                const r = new EcAlignment();
                r.generateId(repo.selectedServer);
                r.source = source.shortId();
                r.target = target.shortId();
                r.relationType = type;
                r.addOwner(owner.ppk.toPk());
                return r;
            };
            const relations = [
                relation(a, outside, EcAlignment.NARROWS),
                relation(a, b, EcAlignment.IS_EQUIVALENT_TO),
                relation(b, c, 'minorRelated'),
                relation(c, a, 'majorRelated'),
                relation(d, a, EcAlignment.REQUIRES)
            ];

            collection = new EcFramework();
            collection.generateId(repo.selectedServer);
            collection.setName('Characterization Collection');
            collection.subType = 'Collection';
            collection.addOwner(owner.ppk.toPk());
            for (const m of [a, b, c, d, inFramework]) collection.addCompetency(m.shortId());
            for (const r of relations) collection.addRelation(r.shortId());
            await repo.multiput([a, b, c, d, outside, inFramework, framework, ...relations, collection]);
        });

        it('exports a ceterms:Collection whose members carry their alignments', async () => {
            const graph = (await exportGraph(collection.getGuid()))['@graph'];
            const coll = graph.find((o) => o['@type'] === 'ceterms:Collection');
            assert.isDefined(coll, JSON.stringify(graph).slice(0, 500));
            assert.match(coll['ceterms:ctid'], /^ce-/);
            const byText = {};
            for (const o of graph) {
                if (o['@type'] !== 'ceasn:Competency') continue;
                const text = o['ceasn:competencyText'];
                byText[typeof text === 'object' ? Object.values(text)[0] : text] = o;
            }
            assert.includeMembers(Object.keys(byText), ['Alpha', 'Bravo', 'Charlie']);
            assert.notInclude(Object.keys(byText), 'In a framework too');
            const alpha = byText.Alpha;
            const alignments = (name) => Object.keys(byText[name]).filter((k) => /Alignment$/.test(k)).sort();
            assert.deepEqual(alignments('Alpha'), ['ceasn:broadAlignment', 'ceasn:exactAlignment', 'ceasn:majorAlignment']);
            assert.deepEqual(alignments('Bravo'), ['ceasn:exactAlignment', 'ceasn:minorAlignment']);
            assert.deepEqual(alignments('Charlie'), ['ceasn:majorAlignment', 'ceasn:minorAlignment']);
            assert.deepEqual(alignments('Delta, named only by its description.'), ['ceasn:prerequisiteAlignment'], 'a nameless competency is named by its description');
            assert.match(alpha['ceterms:ctid'], /^ce-/);
            assert.isArray(alpha['ceterms:isMemberOf']);
            assert.lengthOf(coll['ceterms:hasMember'], 5, 'every member is listed on the collection');
        });
    });

    describe('import', function () {
        const stamp = 1700000000000;
        const base = 'https://ce.example.org/resources/' + Date.now() + '/';

        it('a collection and its members, dated from their version numbers', async () => {
            const collId = base + 'collection/' + stamp;
            const memberId = base + 'member/' + (stamp + 1);
            await importGraph({
                '@context': ctdlasnContext,
                '@id': base + 'graph',
                '@graph': [
                    {
                        '@id': collId,
                        '@type': 'ceterms:Collection',
                        'ceterms:name': { 'en-US': 'Imported Collection' },
                        'ceterms:hasMember': [memberId]
                    },
                    {
                        '@id': memberId,
                        '@type': 'ceasn:Competency',
                        'ceasn:competencyText': { 'en-US': 'Imported member' }
                    }
                ]
            });
            const f = await EcFramework.get(collId, null, null, repo);
            assert.isNotNull(f);
            assert.strictEqual(f.subType, 'Collection');
            assert.strictEqual(f['schema:dateCreated'], new Date(stamp).toISOString());
            assert.include(f.competency, memberId);
            assert.isTrue(f.hasOwner(owner.ppk.toPk()));
            const c = await EcCompetency.get(memberId, null, null, repo);
            assert.isNotNull(c);
            assert.strictEqual(c['schema:dateCreated'], new Date(stamp + 1).toISOString());
        });

        it('a framework and its competencies, dated from their version numbers', async () => {
            const fwId = base + 'framework/' + (stamp + 2);
            const compId = base + 'competency/' + (stamp + 3);
            await importGraph({
                '@context': ctdlasnContext,
                '@id': base + 'graph2',
                '@graph': [
                    {
                        '@id': fwId,
                        '@type': 'ceasn:CompetencyFramework',
                        'ceasn:name': { 'en-US': 'Imported Framework' },
                        'ceasn:hasTopChild': [compId]
                    },
                    {
                        '@id': compId,
                        '@type': 'ceasn:Competency',
                        'ceasn:competencyText': { 'en-US': 'Imported competency' },
                        'ceasn:isPartOf': fwId,
                        'ceasn:isTopChildOf': fwId
                    }
                ]
            });
            const f = await EcFramework.get(fwId, null, null, repo);
            assert.isNotNull(f);
            assert.strictEqual(f['schema:dateCreated'], new Date(stamp + 2).toISOString());
            const c = await EcCompetency.get(compId, null, null, repo);
            assert.isNotNull(c);
            assert.strictEqual(c['schema:dateCreated'], new Date(stamp + 3).toISOString());
        });

        it('refuses a document with no @graph', async () => {
            const form = new FormData();
            form.append('data', JSON.stringify({ '@context': ctdlasnContext, '@id': base + 'nothing' }));
            const res = await fetch(loopback + 'ctdlasn', { method: 'POST', body: form });
            assert.strictEqual(res.status, 500);
            assert.include(await res.text(), 'no @graph created');
        });
    });
});
