const chai = require('chai');
const assert = chai.assert;
require('cassproject');

const CASS_LOOPBACK = process.env.CASS_LOOPBACK || 'http://localhost/api/';

describe('xAPI Adapter', function () {
    this.timeout(60000);

    let repo;
    let user;
    let agent;
    let framework;
    let c1, c2, c3;
    let emailPrefix;
    let activityBaseUrl;

    it('Waiting for server to be ready', async () => {
        if (process.env.NODEV != null) return;
        if (!global.events || !global.events.server) return;
        let ready = false;
        global.events.server.ready.subscribe(function (isReady) {
            if (!isReady) {
                console.log('Server not ready. Skipping tests.');
                return;
            }
            ready = true;
        });
        while (!ready) { await new Promise((resolve) => setTimeout(resolve, 100)); }
    });

    it('Setup: Create User, Agent, Framework, Competencies, and Persons', async () => {
        repo = new EcRepository();
        await repo.init(CASS_LOOPBACK);

        emailPrefix = 'xapiuser' + new Date().getTime() + '@test.com';
        activityBaseUrl = 'https://test.example.com/activities/' + new Date().getTime() + '/';

        // Create User (Subject — the learner receiving xAPI statements)
        user = new EcIdentity();
        user.ppk = EcPpk.generateKey();
        user.displayName = "xAPI Test User";
        EcIdentityManager.default.addIdentity(user);

        // Setup AUTH_OVERRIDE for the server to recognize us
        global.AUTH_OVERRIDE = JSON.stringify({ name: "xAPI Test User", email: emailPrefix, sub: user.ppk.toPk().fingerprint() });
        global.AUTH_OVERRIDE_KEY = user.ppk.toPem();

        // Create Agent (Assertion Issuer / xAPI Authority)
        agent = new EcIdentity();
        agent.ppk = EcPpk.generateKey();
        agent.displayName = "xAPI Test Agent";
        EcIdentityManager.default.addIdentity(agent);

        // Create Framework
        framework = new EcFramework();
        framework.generateId(repo.selectedServer);
        framework.setName("xAPI Test Framework");
        framework.addOwner(agent.ppk.toPk());

        // Create Competencies
        c1 = new EcCompetency();
        c1.generateId(repo.selectedServer);
        c1.setName("xAPI Competency 1");
        c1.addOwner(agent.ppk.toPk());

        c2 = new EcCompetency();
        c2.generateId(repo.selectedServer);
        c2.setName("xAPI Competency 2");
        c2.addOwner(agent.ppk.toPk());

        c3 = new EcCompetency();
        c3.generateId(repo.selectedServer);
        c3.setName("xAPI Competency 3");
        c3.addOwner(agent.ppk.toPk());

        framework.addCompetency(c1.shortId());
        framework.addCompetency(c2.shortId());
        framework.addCompetency(c3.shortId());

        // Relation: C1 narrows C2
        let r1 = new EcAlignment();
        r1.generateId(repo.selectedServer);
        r1.source = c1.shortId();
        r1.target = c2.shortId();
        r1.relationType = "narrows";
        r1.addOwner(agent.ppk.toPk());
        framework.addRelation(r1.shortId());

        // Relation: C1 narrows C3
        let r2 = new EcAlignment();
        r2.generateId(repo.selectedServer);
        r2.source = c1.shortId();
        r2.target = c3.shortId();
        r2.relationType = "narrows";
        r2.addOwner(agent.ppk.toPk());
        framework.addRelation(r2.shortId());

        // Save everything
        await repo.saveTo(c1);
        await repo.saveTo(c2);
        await repo.saveTo(c3);
        await repo.saveTo(r1);
        await repo.saveTo(r2);
        await repo.saveTo(framework);

        // Create EcPerson for the user (with email matching the xAPI actor mbox)
        let person = new EcPerson();
        person.assignId(repo.selectedServer, user.ppk.toPk().fingerprint());
        person.addOwner(user.ppk.toPk());
        person.email = emailPrefix;
        person.setName("xAPI Test Person");
        await repo.saveTo(person);

        // Create EcPerson for the agent/authority
        let agentPerson = new EcPerson();
        agentPerson.assignId(repo.selectedServer, agent.ppk.toPk().fingerprint());
        agentPerson.addOwner(agent.ppk.toPk());
        agentPerson.email = 'xapiagent' + new Date().getTime() + '@test.com';
        agentPerson.setName("xAPI Test Agent Person");
        await repo.saveTo(agentPerson);

        // Wait for Elasticsearch to index
        
    });

    /**
     * Helper: Build an xAPI statement.
     */
    function buildXapiStatement(opts) {
        return {
            id: opts.id || EcCrypto.generateUUID(),
            actor: {
                objectType: "Agent",
                mbox: "mailto:" + emailPrefix,
                name: "xAPI Test User"
            },
            verb: {
                id: opts.verbId || "http://adlnet.gov/expapi/verbs/completed",
                display: { "en-US": opts.verbDisplay || "completed" }
            },
            object: {
                id: opts.objectId,
                objectType: "Activity",
                definition: opts.definition || {
                    name: { "en-US": opts.objectName || "Test Activity" },
                    description: { "en-US": opts.objectDescription || "A test activity" }
                }
            },
            result: opts.result || { success: true },
            authority: {
                objectType: "Agent",
                mbox: "mailto:" + (opts.authorityEmail || 'xapiagent' + new Date().getTime() + '@test.com'),
                name: "xAPI Test Agent Person"
            },
            timestamp: opts.timestamp || new Date().toISOString(),
            context: opts.context || {}
        };
    }

    /**
     * Helper: Submit an xAPI statement via POST to /api/xapi/statement.
     */
    async function submitStatement(statement) {
        const formData = new FormData();
        const res = await fetch(`${CASS_LOOPBACK}xapi/statement`, {
            method: 'POST',
            body: JSON.stringify(statement),
            headers: { 'Content-Type': 'application/json' }
        });
        assert.strictEqual(res.status, 200, 'Failed to submit xAPI statement: ' + await res.text());
    }

    describe('CreativeWork-based assertion generation', function () {
        let activityUrl;

        it('Setup: Create CreativeWork aligned to C1', async () => {
            activityUrl = activityBaseUrl + 'aligned-to-c1';

            // Create a CreativeWork that maps the activity URL to competency C1
            let cw = new schema.CreativeWork();
            cw.assignId(repo.selectedServer,EcCrypto.md5(activityUrl));
            cw.url = activityUrl;
            cw.name = "Activity Aligned to C1";
            cw.educationalAlignment = [{
                targetUrl: c1.shortId(),
                educationalFramework: framework.shortId()
            }];
            cw.addOwner(agent.ppk.toPk());
            await repo.saveTo(cw);

            // Wait for Elasticsearch to index
            
        });

        it('Submit positive xAPI statement and verify assertion is created', async () => {
            const stmt = buildXapiStatement({
                objectId: activityUrl,
                objectName: "Aligned Activity",
                result: { success: true }
            });
            await submitStatement(stmt);

            // Wait for Elasticsearch to index the new assertion
            

            // Check profile for C1 positive evidence
            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            // C1 should now have positive evidence via the xAPI assertion
            const comp2 = profile.children.find(c => c.id === c2.shortId());
            assert.isDefined(comp2, 'C2 should be in profile children');
            const comp1 = comp2.children.find(c => c.id === c1.shortId());
            assert.isDefined(comp1, 'C1 should be a child of C2');
            assert.isTrue(comp1.state.hasPositiveEvidence, 'C1 should have positive evidence from xAPI statement');
            assert.isTrue(comp1.state.latestEvidenceIsPositive, 'C1 latest evidence should be positive');
        });

        it('Submit negative xAPI statement for same activity and verify negative evidence', async () => {
            const stmt = buildXapiStatement({
                objectId: activityUrl,
                objectName: "Aligned Activity",
                result: { success: false }
            });
            await submitStatement(stmt);

            

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp2 = profile.children.find(c => c.id === c2.shortId());
            const comp1 = comp2.children.find(c => c.id === c1.shortId());
            assert.isTrue(comp1.state.hasNegativeEvidence, 'C1 should have negative evidence');
        });
    });

    describe('Multi-competency alignment', function () {
        let multiActivityUrl;

        it('Setup: Create CreativeWork aligned to C2 and C3', async () => {
            multiActivityUrl = activityBaseUrl + 'aligned-to-c2-c3';

            let cw = new schema.CreativeWork();
            cw.generateId(repo.selectedServer);
            cw.url = multiActivityUrl;
            cw.name = "Activity Aligned to C2 and C3";
            cw.educationalAlignment = [
                { targetUrl: c2.shortId(), educationalFramework: framework.shortId() },
                { targetUrl: c3.shortId(), educationalFramework: framework.shortId() }
            ];
            cw.addOwner(agent.ppk.toPk());
            await repo.saveTo(cw);

            
        });

        it('Submit positive xAPI statement and verify assertions for both C2 and C3', async () => {
            const stmt = buildXapiStatement({
                objectId: multiActivityUrl,
                objectName: "Multi-Aligned Activity",
                result: { success: true }
            });
            await submitStatement(stmt);

            

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp2 = profile.children.find(c => c.id === c2.shortId());
            assert.isDefined(comp2, 'C2 should be in profile');
            assert.isTrue(comp2.state.hasPositiveEvidence, 'C2 should have positive evidence');

            const comp3 = profile.children.find(c => c.id === c3.shortId());
            assert.isDefined(comp3, 'C3 should be in profile');
            assert.isTrue(comp3.state.hasPositiveEvidence, 'C3 should have positive evidence');

            // C2 should also inherit child evidence from C1 (from previous test)
            assert.isTrue(comp2.state.hasAnyChildrenWithPositiveEvidence, 'C2 should have children with positive evidence');
        });
    });

    describe('Score-based assertion generation', function () {
        let scoreActivityUrl;

        it('Setup: Create CreativeWork aligned to C1 for score test', async () => {
            scoreActivityUrl = activityBaseUrl + 'score-test';

            let cw = new schema.CreativeWork();
            cw.generateId(repo.selectedServer);
            cw.url = scoreActivityUrl;
            cw.name = "Score-Based Activity";
            cw.educationalAlignment = [{
                targetUrl: c1.shortId(),
                educationalFramework: framework.shortId()
            }];
            cw.addOwner(agent.ppk.toPk());
            await repo.saveTo(cw);
        });

        it('Submit xAPI statement with high score (>0.7) and verify positive assertion', async () => {
            const stmt = buildXapiStatement({
                objectId: scoreActivityUrl,
                objectName: "High Score Activity",
                result: { score: { scaled: 0.85 } }
            });
            await submitStatement(stmt);

            // Search for assertions on C1 — the xAPI adapter should have created one
            let assertions = await repo.searchWithParams(
                `competency:"${c1.shortId()}"`,
                { size: 100, index_hint: "*assertion" }
            );
            let found = assertions.some(a => a.competency === c1.shortId());
            assert.isTrue(found, 'Should find an assertion for C1 from the high-score xAPI statement');
        });

        it('Submit xAPI statement with low score (<=0.7) and verify negative assertion', async () => {
            const stmt = buildXapiStatement({
                objectId: scoreActivityUrl,
                objectName: "Low Score Activity",
                result: { score: { scaled: 0.4 } }
            });
            await submitStatement(stmt);

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp2 = profile.children.find(c => c.id === c2.shortId());
            const comp1 = comp2.children.find(c => c.id === c1.shortId());
            assert.isTrue(comp1.state.hasNegativeEvidence, 'C1 should have negative evidence from low score');
        });
    });

    describe('Auto-creation of CreativeWork for unknown object IDs', function () {
        let unknownActivityUrl;

        it('Submit xAPI statement with unknown object ID and verify CreativeWork is created', async () => {
            unknownActivityUrl = activityBaseUrl + 'auto-created-' + new Date().getTime();

            const stmt = buildXapiStatement({
                objectId: unknownActivityUrl,
                objectName: "Auto-Created Activity",
                definition: {
                    name: { "en-US": "Auto-Created Activity" },
                    description: { "en-US": "This activity was not pre-registered" }
                },
                result: { success: true }
            });
            await submitStatement(stmt);

            // Search for the auto-created CreativeWork
            let creativeWorks = await repo.searchWithParams(
                `@type:CreativeWork AND url:"${unknownActivityUrl}"`,
                { size: 10 }
            );
            assert.isTrue(creativeWorks.length > 0, 'CreativeWork should have been auto-created for unknown activity');

            let cw = creativeWorks[0];
            assert.strictEqual(cw.url, unknownActivityUrl, 'CreativeWork url should match the activity ID');
            assert.strictEqual(cw.name, "Auto-Created Activity", 'CreativeWork name should come from definition.name');
        });

        it('Auto-created CreativeWork should have no educationalAlignment', async () => {
            let creativeWorks = await repo.searchWithParams(
                `@type:CreativeWork AND url:"${unknownActivityUrl}"`,
                { size: 10 }
            );
            assert.isTrue(creativeWorks.length > 0, 'CreativeWork should exist');
            let cw = creativeWorks[0];
            assert.isTrue(
                cw.educationalAlignment == null || (Array.isArray(cw.educationalAlignment) && cw.educationalAlignment.length === 0),
                'Auto-created CreativeWork should have no educationalAlignment'
            );
        });

        it('Auto-created CreativeWork name should fall back through definition fields', async () => {
            // Submit a statement with no definition.name but with a description
            let fallbackUrl = activityBaseUrl + 'fallback-name-' + new Date().getTime();
            const stmt = buildXapiStatement({
                objectId: fallbackUrl,
                definition: {
                    name: { "en-US": "Fallback Description Name" }
                },
                result: { success: true }
            });
            await submitStatement(stmt);

            let creativeWorks = await repo.searchWithParams(
                `@type:CreativeWork AND url:"${fallbackUrl}"`,
                { size: 10 }
            );
            assert.isTrue(creativeWorks.length > 0, 'CreativeWork should have been auto-created');
            assert.strictEqual(creativeWorks[0].name, "Fallback Description Name", 'Name should fall back to description');
        });

        it('Auto-created CreativeWork description should fall back through definition fields', async () => {
            // Submit a statement with no definition.name but with a description
            let fallbackUrl = activityBaseUrl + 'fallback-name-2-' + new Date().getTime();
            const stmt = buildXapiStatement({
                objectId: fallbackUrl,
                definition: {
                    description: { "en-US": "Fallback Description" }
                },
                result: { success: true }
            });
            await submitStatement(stmt);

            let creativeWorks = await repo.searchWithParams(
                `@type:CreativeWork AND url:"${fallbackUrl}"`,
                { size: 10 }
            );
            assert.isTrue(creativeWorks.length > 0, 'CreativeWork should have been auto-created');
            assert.strictEqual(creativeWorks[0].description, "Fallback Description", 'Description should fall back to description');
        });

    });

    describe('Response-based assertion generation', function () {
        let responseActivityUrl;

        it('Setup: Create CreativeWork aligned to C2 for response tests', async () => {
            responseActivityUrl = activityBaseUrl + 'response-test';

            let cw = new schema.CreativeWork();
            cw.generateId(repo.selectedServer);
            cw.url = responseActivityUrl;
            cw.name = "Response-Based Activity";
            cw.educationalAlignment = [{
                targetUrl: c2.shortId(),
                educationalFramework: framework.shortId()
            }];
            cw.addOwner(agent.ppk.toPk());
            await repo.saveTo(cw);            
        });

        it('Submit xAPI statement with result.response "Pass" and verify positive assertion', async () => {
            const stmt = buildXapiStatement({
                objectId: responseActivityUrl,
                objectName: "Pass Response Activity",
                result: { response: "Pass" }
            });
            await submitStatement(stmt);
            
            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp2 = profile.children.find(c => c.id === c2.shortId());
            assert.isDefined(comp2, 'C2 should be in profile');
            assert.isTrue(comp2.state.hasPositiveEvidence, 'C2 should have positive evidence from "Pass" response');
        });

        it('Submit xAPI statement with result.response "Fail" and verify negative assertion', async () => {
            const stmt = buildXapiStatement({
                objectId: responseActivityUrl,
                objectName: "Fail Response Activity",
                result: { response: "Fail" }
            });
            await submitStatement(stmt);

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp2 = profile.children.find(c => c.id === c2.shortId());
            assert.isTrue(comp2.state.hasNegativeEvidence, 'C2 should have negative evidence from "Fail" response');
        });
    });

    describe('Statements with no actionable result are ignored', function () {
        it('Submit xAPI statement with no result and verify no assertion', async () => {
            let noResultUrl = activityBaseUrl + 'no-result';

            let cw = new schema.CreativeWork();
            cw.generateId(repo.selectedServer);
            cw.url = noResultUrl;
            cw.name = "No Result Activity";
            cw.educationalAlignment = [{
                targetUrl: c3.shortId(),
                educationalFramework: framework.shortId()
            }];
            cw.addOwner(agent.ppk.toPk());
            await repo.saveTo(cw);
            

            // Submit a statement with NO result at all — the adapter should skip it
            const formData = new FormData();
            const stmt = {
                id: EcCrypto.generateUUID(),
                actor: { objectType: "Agent", mbox: "mailto:" + emailPrefix, name: "xAPI Test User" },
                verb: { id: "http://adlnet.gov/expapi/verbs/experienced", display: { "en-US": "experienced" } },
                object: { id: noResultUrl, objectType: "Activity", definition: { name: { "en-US": "No Result Activity" } } },
                timestamp: new Date().toISOString()
                // NOTE: no 'result' field
            };
            formData.append('statement', JSON.stringify(stmt));
            const res = await fetch(`${CASS_LOOPBACK}xapi/statement`, { method: 'POST', body: formData });
            assert.strictEqual(res.status, 200);
            // No assertion should have been created — this is an implicit success
        });
    });

    describe('Direct competency URL as object.id', function () {
        it('Submit xAPI statement with competency URL as object.id and verify positive assertion', async () => {
            const stmt = buildXapiStatement({
                objectId: c1.shortId(),
                objectName: "Direct Competency C1",
                result: { success: true }
            });
            await submitStatement(stmt);

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp2 = profile.children.find(c => c.id === c2.shortId());
            assert.isDefined(comp2, 'C2 should be in profile children');
            const comp1 = comp2.children.find(c => c.id === c1.shortId());
            assert.isDefined(comp1, 'C1 should be a child of C2');
            assert.isTrue(comp1.state.hasPositiveEvidence, 'C1 should have positive evidence from direct competency object.id');
        });

        it('Submit xAPI statement with competency URL as object.id and verify negative assertion', async () => {
            const stmt = buildXapiStatement({
                objectId: c3.shortId(),
                objectName: "Direct Competency C3",
                result: { success: false }
            });
            await submitStatement(stmt);

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp3 = profile.children.find(c => c.id === c3.shortId());
            assert.isDefined(comp3, 'C3 should be in profile');
            assert.isTrue(comp3.state.hasNegativeEvidence, 'C3 should have negative evidence from direct competency object.id');
        });

        it('Submit xAPI statement with score-based result using competency URL as object.id', async () => {
            const stmt = buildXapiStatement({
                objectId: c2.shortId(),
                objectName: "Direct Competency C2 - Scored",
                result: { score: { scaled: 0.95 } }
            });
            await submitStatement(stmt);

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp2 = profile.children.find(c => c.id === c2.shortId());
            assert.isDefined(comp2, 'C2 should be in profile');
            assert.isTrue(comp2.state.hasPositiveEvidence, 'C2 should have positive evidence from high score via direct competency URL');
        });

        it('No CreativeWork is auto-created when object.id is a valid competency URL', async () => {
            // Search for CreativeWorks with url matching the competency ID
            let creativeWorks = await repo.searchWithParams(
                `@type:CreativeWork AND url:"${c1.shortId()}"`,
                { size: 10 }
            );
            assert.strictEqual(creativeWorks.length, 0, 'No CreativeWork should be auto-created when object.id resolves to a competency');
        });
    });

    describe('Competency URL via object.definition.moreInfo', function () {
        it('Submit xAPI statement with moreInfo pointing to a competency and verify assertion', async () => {
            const moreInfoActivityUrl = activityBaseUrl + 'moreinfo-test-' + new Date().getTime();
            const stmt = buildXapiStatement({
                objectId: moreInfoActivityUrl,
                objectName: "Activity with moreInfo",
                definition: {
                    name: { "en-US": "Activity with moreInfo Competency Link" },
                    description: { "en-US": "Tests moreInfo-based competency resolution" },
                    moreInfo: c2.shortId()
                },
                result: { success: true }
            });
            await submitStatement(stmt);

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp2 = profile.children.find(c => c.id === c2.shortId());
            assert.isDefined(comp2, 'C2 should be in profile');
            assert.isTrue(comp2.state.hasPositiveEvidence, 'C2 should have positive evidence from moreInfo competency link');
        });

        it('Submit xAPI statement with moreInfo pointing to a different competency and verify negative assertion', async () => {
            const moreInfoActivityUrl2 = activityBaseUrl + 'moreinfo-test2-' + new Date().getTime();
            const stmt = buildXapiStatement({
                objectId: moreInfoActivityUrl2,
                objectName: "Activity with moreInfo to C3",
                definition: {
                    name: { "en-US": "Activity with moreInfo to C3" },
                    moreInfo: c3.shortId()
                },
                result: { score: { scaled: 0.3 } }
            });
            await submitStatement(stmt);

            const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.shortId()}&cache=false&flushCache=true`;
            const res = await fetch(url);
            let text = await res.text();
            assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + text);
            const profile = JSON.parse(text);

            const comp3 = profile.children.find(c => c.id === c3.shortId());
            assert.isDefined(comp3, 'C3 should be in profile');
            assert.isTrue(comp3.state.hasNegativeEvidence, 'C3 should have negative evidence from low score via moreInfo');
        });
    });

    after(() => {
        delete global.AUTH_OVERRIDE;
        delete global.AUTH_OVERRIDE_KEY;
    });
});
