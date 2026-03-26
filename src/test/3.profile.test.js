const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
require('cassproject');

const CASS_LOOPBACK = process.env.CASS_LOOPBACK || 'http://localhost/api/';

describe('Profile API', function () {
    this.timeout(60000);

    let repo;
    let user;
    let agent;
    let framework;
    let c1, c2, c3;
    let emailPrefix;

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

    it('Setup: Create User, Agent, Framework, and Competencies', async () => {
        repo = new EcRepository();
        await repo.init(CASS_LOOPBACK);
        // Generate email prefix for unique test data
        emailPrefix = 'testuser+' + new Date().getTime() + '@test.com';

        // Create User (Subject)
        user = new EcIdentity();
        user.ppk = EcPpk.generateKey();
        user.displayName = "Test User";
        EcIdentityManager.default.addIdentity(user);

        // Setup AUTH_OVERRIDE for the server to recognize us
        global.AUTH_OVERRIDE = JSON.stringify({ name: "Test User", email: emailPrefix, sub: user.ppk.toPk().fingerprint() });
        global.AUTH_OVERRIDE_KEY = user.ppk.toPem();

        // Create Agent (Assertion Issuer)
        agent = new EcIdentity();
        agent.ppk = EcPpk.generateKey();
        agent.displayName = "Test Agent";
        EcIdentityManager.default.addIdentity(agent);

        // Create Framework
        framework = new EcFramework();
        framework.generateId(repo.selectedServer);
        framework.setName("Test Framework");
        framework.addOwner(agent.ppk.toPk());

        // Create Competencies
        c1 = new EcCompetency();
        c1.generateId(repo.selectedServer);
        c1.setName("Competency 1");
        c1.addOwner(agent.ppk.toPk());

        c2 = new EcCompetency();
        c2.generateId(repo.selectedServer);
        c2.setName("Competency 2");
        c2.addOwner(agent.ppk.toPk());

        c3 = new EcCompetency();
        c3.generateId(repo.selectedServer);
        c3.setName("Competency 3");
        c3.addOwner(agent.ppk.toPk());

        framework.addCompetency(c1.id);
        framework.addCompetency(c2.id);
        framework.addCompetency(c3.id);

        // Relation: C1 narrows C2
        let r1 = new EcAlignment();
        r1.generateId(repo.selectedServer);
        r1.source = c1.id;
        r1.target = c2.id;
        r1.relationType = "narrows";
        r1.addOwner(agent.ppk.toPk());
        framework.addRelation(r1.id);

        // Save everything
        await repo.saveTo(c1);
        await repo.saveTo(c2);
        await repo.saveTo(c3);
        await repo.saveTo(r1);
        await repo.saveTo(framework);

        // Create EcPerson for the user so anythingToPerson works
        let person = new EcPerson();
        person.generateId(repo.selectedServer);
        person.addOwner(user.ppk.toPk());
        person.email = emailPrefix;
        person.setName("Test Person");
        await repo.saveTo(person);
    });

    it('Initial profile calculation (no assertions)', async () => {
        const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.id}&cache=false`;
        const res = await fetch(url);
        assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + await res.text());
        const profile = await res.json();
        
        assert.equal(profile.id, framework.id);
        assert.equal(profile.children.length, 2); // C2 (parent of C1) and C3 (standalone)
        
        // Find C2 and check its children
        const comp2 = profile.children.find(c => c.id === c2.id);
        assert.isDefined(comp2);
        assert.equal(comp2.children.length, 1);
        assert.equal(comp2.children[0].id, c1.id);

        // Check state
        assert.isFalse(comp2.state.hasPositiveEvidence);
        assert.isFalse(comp2.children[0].state.hasPositiveEvidence);
    });

    it('Add positive assertion for C1 and verify profile (multi-volley simulation)', async () => {
        let a = new EcAssertion();
        a.generateId(repo.selectedServer);
        a.setSubject(user.ppk.toPk());
        a.setAgent(agent.ppk.toPk());
        a.competency = c1.id;
        a.setAssertionDate(new Date().getTime());
        a.setNegative(false);
        a.addOwner(agent.ppk.toPk());
        await repo.saveTo(a);

        const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.id}&cache=false&flushCache=true`;
        const res = await fetch(url);
        assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + await res.text());
        const profile = await res.json();

        // C1 should have positive evidence
        const comp2 = profile.children.find(c => c.id === c2.id);
        const comp1 = comp2.children.find(c => c.id === c1.id);
        
        assert.isTrue(comp1.state.hasPositiveEvidence);
        assert.isTrue(comp1.state.latestEvidenceIsPositive);

        // C2 should NOT necessarily have positive evidence itself, but might have children with positive evidence
        assert.isTrue(comp2.state.hasAnyChildrenWithPositiveEvidence);
    });

    it('Add negative assertion for C2 and verify conflict', async () => {
        let a = new EcAssertion();
        a.generateId(repo.selectedServer);
        a.setSubject(user.ppk.toPk());
        a.setAgent(agent.ppk.toPk());
        a.competency = c2.id;
        a.setAssertionDate(new Date().getTime());
        a.setNegative(true);
        a.addOwner(agent.ppk.toPk());
        await repo.saveTo(a);

        const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.id}&cache=false&flushCache=true`;
        const res = await fetch(url);
        assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + await res.text());
        const profile = await res.json();

        const comp2 = profile.children.find(c => c.id === c2.id);
        assert.isTrue(comp2.state.hasNegativeEvidence);
        assert.isFalse(comp2.state.latestEvidenceIsPositive);
    });

    it('Multi-volley profile calculation with relations and assertions', async () => {
        // C3 narrows C1
        let r2 = new EcAlignment();
        r2.generateId(repo.selectedServer);
        r2.source = c3.id;
        r2.target = c1.id;
        r2.relationType = "narrows";
        r2.addOwner(agent.ppk.toPk());
        
        framework.addRelation(r2.id);
        await repo.saveTo(r2);
        await repo.saveTo(framework);

        // Add assertion for C3
        let a = new EcAssertion();
        a.generateId(repo.selectedServer);
        a.setSubject(user.ppk.toPk());
        a.setAgent(agent.ppk.toPk());
        a.competency = c3.id;
        a.setAssertionDate(new Date().getTime());
        a.setNegative(false);
        a.addOwner(agent.ppk.toPk());
        await repo.saveTo(a);

        const url = `${repo.selectedServer}profile/latest?subject=${emailPrefix}&frameworkId=${framework.id}&cache=false&flushCache=true`;
        const res = await fetch(url);
        assert.strictEqual(res.status, 200, 'Failed to fetch profile: ' + await res.text());
        const profile = await res.json();

        // Structure: C2 -> narrows -> C1 -> narrows -> C3
        // In the profile tree, it should be C2 (top) -> C1 -> C3
        const comp2 = profile.children.find(c => c.id === c2.id);
        assert.equal(comp2.children.length, 1);
        const comp1 = comp2.children[0];
        assert.equal(comp1.id, c1.id);
        assert.equal(comp1.children.length, 1);
        const comp3 = comp1.children[0];
        assert.equal(comp3.id, c3.id);

        assert.isTrue(comp3.state.hasPositiveEvidence);
        assert.isTrue(comp1.state.hasAnyChildrenWithPositiveEvidence);
        assert.isTrue(comp2.state.hasAnyChildrenWithPositiveEvidence);
    });

    after(() => {
        delete global.AUTH_OVERRIDE;
        delete global.AUTH_OVERRIDE_KEY;
    });
});
