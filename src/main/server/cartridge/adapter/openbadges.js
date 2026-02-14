let loopback = require('../../shims/cassproject.js');

badgeSetup = function () {
    this.setup = true;

    EcRepository.caching = false;
    var identity = new EcIdentity();
    identity.ppk = EcPpk.fromPem(keyFor("adapter.openbadges.private"));
    identity.displayName = "OpenBadges Internal Identity";
    EcIdentityManager.default.addIdentity(identity);
}

badgeKey = function () {
    return EcPpk.fromPem(keyFor("adapter.openbadges.private")).toPk().toPem();
}


badgeGetPerson = async function (fingerprint) {
    var person = await loopback.repositoryGet(global.repo.selectedServer + "data/" + fingerprint);
    if (person == null)
        return null;

    if (person.isAny(new EcEncryptedValue().getTypes())) {
        var v = new EcEncryptedValue();
        v.copyFrom(person);
        person = v.decryptIntoObject();
    }
    return person;
}

badgeCryptographicKey = async function (fingerprint) {
    badgeSetup.call(this);
    if (fingerprint == null)
        fingerprint = this.params.urlRemainder.replace("/", "");
    var person = await badgeGetPerson.call(this, fingerprint);
    if (person == null)
        error("Insufficient data available to generate cryptographic key.", 405);

    return JSON.stringify({
        "@context": "https://w3id.org/openbadges/v2",
        id: global.repo.selectedServer + "badge/cryptographicKey/" + fingerprint,
        type: "CryptographicKey",
        owner: global.repo.selectedServer + "data/" + fingerprint,
        publicKeyPem: person.publicKey
    });
};

badgeProfile = async function (fingerprint) {
    badgeSetup.call(this);
    if (fingerprint == null)
        fingerprint = this.params.urlRemainder.replace("/", "");
    var person = await badgeGetPerson.call(this, fingerprint);
    if (person == null)
        error("Insufficient data available to generate issuer.", 405);

    return JSON.stringify({
        "@context": "https://w3id.org/openbadges/v2",
        id: global.repo.selectedServer + "badge/profile/" + fingerprint,
        type: "Issuer",
        name: person.name,
        url: person.url == null ? (global.repo.selectedServer + "badge/profile/" + fingerprint) : person.url,
        telephone: person.telephone,
        description: person.description,
        image: "https://api.badgr.io/public/badges/X7kb4H72TXiMoYN_kJNdEQ/image",
        email: person.email,
        publicKey: global.repo.selectedServer + "badge/cryptographicKey/" + fingerprint,
        verification: {
            type: "hosted"
        }
    })
};

badgeSubject = async function (fingerprint) {
    badgeSetup.call(this);
    if (fingerprint == null)
        fingerprint = this.params.urlRemainder.replace("/", "");
    var person = await badgeGetPerson.call(this, fingerprint);
    if (person == null)
        error("Insufficient data available to generate identityObject.", 405);

    if (person.email != null) {
        var sha = forge.md.sha256.create();
        var salt = fingerprint;
        sha.update(person.email + salt);
        var hashed = "sha256$" + sha.digest().toHex();
        return JSON.stringify({
            type: "email",
            identity: hashed,
            salt: salt,
            hashed: true
        })
    }
    if (person.url != null) {
        var sha = forge.md.sha256.create();
        var salt = fingerprint;
        sha.update(person.url + salt);
        var hashed = "sha256$" + sha.digest().toHex();
        return JSON.stringify({
            type: "url",
            identity: hashed,
            salt: salt,
            hashed: true
        })
    }
    if (person.telephone != null) {
        var sha = forge.md.sha256.create();
        var salt = fingerprint;
        sha.update(person.telephone + salt);
        var hashed = "sha256$" + sha.digest().toHex();
        return JSON.stringify({
            type: "telephone",
            identity: hashed,
            salt: salt,
            hashed: true
        })
    }
};

badgeClass = async function (competencyId, fingerprint, assertion) {
    badgeSetup.call(this);

    var competency = null;
    if (competencyId != null)
        competency = await loopback.competencyGet(competencyId);
    else {
        var query = queryParse.call(this);
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "BadgeClass", query);
        competency = await loopback.competencyGet(global.repo.selectedServer + "data/" + query.type);
        fingerprint = query.id;
    }

    var competencyAlignment = new schema.AlignmentObject();
    competencyAlignment.alignmentType = "requires";
    competencyAlignment.targetUrl = competency.id;
    competencyAlignment.targetName = competency.name;
    if (assertion != null)
        competencyAlignment.educationalFramework = assertion.framework;

    competencyId = global.repo.selectedServer + "badge/class/" + competency.getGuid() + "/" + fingerprint;
    if (competency.id.startsWith(global.repo.selectedServer) == false) {
        var md5 = forge.md.md5.create();
        md5.update(competency.id);
        competencyId = global.repo.selectedServer + "badge/class/" + md5.digest().toHex() + "/" + fingerprint;
    }

    var criteria = { type: "Criteria" };
    if (competency.description != null)
        criteria.narrative = competency.description;
    else
        criteria.narrative = competency.getName();
    return JSON.stringify({
        "@context": "https://w3id.org/openbadges/v2",
        id: competencyId,
        type: "BadgeClass",
        issuer: global.repo.selectedServer + "badge/profile/" + fingerprint,
        name: competency.name,
        criteria: criteria,
        description: competency.description == null ? competency.name : competency.description,
        image: "https://api.badgr.io/public/badges/X7kb4H72TXiMoYN_kJNdEQ/image",
        alignment: [competencyAlignment]
    });
};

badgeAssertion = async function () {
    badgeSetup.call(this);

    var query = queryParse.call(this);
    var assertion = await loopback.repositoryGet(global.repo.selectedServer + "data/" + query.id);
    if (assertion == null)
        error("Assertion not found.", 404);
    var a = new EcAssertion();
    a.copyFrom(assertion);

    var subject = await a.getSubject();
    if (subject == null)
        error("Not authorized to perform this operation. Add the key found at /badge/pk to the assertion's readers.", 401);
    var agent = await a.getAgent();
    if (agent == null)
        error("Not authorized to perform this operation. Add the key found at /badge/pk to the assertion's readers.", 401);
    subject = JSON.parse(await badgeSubject(subject.fingerprint()));
    if (subject == null)
        error("Insufficient data available to generate badge recipient object.", 405);
    var clazz = JSON.parse(await badgeClass(a.competency, agent.fingerprint(), a));
    if (clazz == null)
        error("Insufficient data available to generate badge class object.", 405);
    agent = JSON.parse(await badgeProfile(agent.fingerprint()));
    if (agent == null)
        error("Insufficient data available to generate badge issuer object.", 405);

    var evidences = [];
    for (var i = 0; i < a.getEvidenceCount(); i++) {
        var evidence = await a.getEvidence(i);
        if (evidence.toLowerCase().startsWith("http"))
            evidences.push(evidence);
        else if (EcObject.isObject(evidence))
            evidences.push(evidence);
        else
            evidences.push({ type: "Evidence", narrative: evidence });
    }
    if (evidences.length == 1)
        evidences = evidences[0];
    var result = {
        "@context": "https://w3id.org/openbadges/v2",
        "id": global.repo.selectedServer + "badge/assertion/" + query.id,
        "type": "Assertion",
        "recipient": subject,
        "evidence": evidences,
        "narrative": "This individual was claimed to have demonstrated this competency.",
        "image": "https://api.badgr.io/public/badges/X7kb4H72TXiMoYN_kJNdEQ/image",
        "issuedOn": new Date(await a.getAssertionDate()).toISOString(),
        "expires": new Date(await a.getExpirationDate()).toISOString(),
        "badge": clazz.id,
        "verification": {
            "type": "HostedBadge"
        }
    };
    //    result = bakeImage(result);
    return JSON.stringify(result);
}

openbadgeCheckId = async function () {
    badgeSetup.call(this);

    var a = new EcAssertion();
    a.copyFrom(JSON.parse(this.params.obj));

    if (a.subject["reader"] == null && a.subject["@reader"] == null)
        return debug("Badge not generated for assertion: Assertion has no readers.");

    if (global.repo.selectedServer.contains("localhost"))
        return debug("Badge not generated for assertion: Endpoint Configuration is not set.");

    if (a.subject["reader"] && !EcArray.has(a.subject["reader"], EcPpk.fromPem(EcPpk.fromPem(keyFor("adapter.openbadges.private"))).toPk().toPem()) && !a.hasOwner(EcPpk.fromPem(EcPpk.fromPem(keyFor("adapter.openbadges.private"))).toPk()))
        return debug("Badge not generated for assertion: Badge Adapter is not an owner nor reader.");

    if (a.subject["@reader"] && !EcArray.has(a.subject["@reader"], EcPpk.fromPem(EcPpk.fromPem(keyFor("adapter.openbadges.private"))).toPk().toPem()) && !a.hasOwner(EcPpk.fromPem(EcPpk.fromPem(keyFor("adapter.openbadges.private"))).toPk()))
        return debug("Badge not generated for assertion: Badge Adapter is not an owner nor reader.");

    var subject = await a.getSubject();
    if (subject == null)
        return debug("Badge not generated for assertion: No subject found.");
    var person = await badgeGetPerson.call(this, subject.fingerprint());
    if (person == null)
        return debug("Badge not generated for assertion: Subject profile not found.");

    if (person.email == null)
        return debug("Badge not generated for assertion: Profile does not contain email address.");

    badgeSendEmail({
        recipient: person.email,
        competencyName: await loopback.repositoryGet(a.competency).name,
        badgeId: global.repo.selectedServer + "badge/assertion/" + a.getGuid()
    });
}

if (!global.disabledAdapters['badge']) {
    /**
     * @openapi
     * /api/badge/pk:
     *   get:
     *     tags:
     *       - OpenBadges Adapter
     *     summary: Get the OpenBadges adapter public key
     *     description: Returns the PEM-encoded public key used by the OpenBadges adapter for signing and verification.
     *     responses:
     *       200:
     *         description: PEM-encoded public key string.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     */
    bindWebService("/badge/pk", badgeKey);

    /**
     * @openapi
     * /api/badge/profile/{fingerprint}:
     *   get:
     *     tags:
     *       - OpenBadges Adapter
     *     summary: Get an OpenBadges v2 Issuer profile
     *     description: Returns an OpenBadges v2 Issuer profile object for the person identified by their public key fingerprint.
     *     parameters:
     *       - in: path
     *         name: fingerprint
     *         required: true
     *         schema:
     *           type: string
     *         description: Public key fingerprint of the person.
     *     responses:
     *       200:
     *         description: OpenBadges v2 Issuer profile JSON.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       405:
     *         description: Insufficient data to generate the profile.
     */
    bindWebService("/badge/profile/*", badgeProfile);

    /**
     * @openapi
     * /api/badge/cryptographicKey/{fingerprint}:
     *   get:
     *     tags:
     *       - OpenBadges Adapter
     *     summary: Get an OpenBadges v2 CryptographicKey
     *     description: Returns a CryptographicKey object for verifying badges issued by the given person.
     *     parameters:
     *       - in: path
     *         name: fingerprint
     *         required: true
     *         schema:
     *           type: string
     *         description: Public key fingerprint of the person.
     *     responses:
     *       200:
     *         description: OpenBadges v2 CryptographicKey JSON.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       405:
     *         description: Insufficient data to generate the cryptographic key.
     */
    bindWebService("/badge/cryptographicKey/*", badgeCryptographicKey);

    /**
     * @openapi
     * /api/badge/class/{competencyId}/{fingerprint}:
     *   get:
     *     tags:
     *       - OpenBadges Adapter
     *     summary: Get an OpenBadges v2 BadgeClass
     *     description: Returns a BadgeClass object for a specific competency, representing the badge that can be earned.
     *     parameters:
     *       - in: path
     *         name: competencyId
     *         required: true
     *         schema:
     *           type: string
     *         description: Competency GUID.
     *       - in: path
     *         name: fingerprint
     *         required: true
     *         schema:
     *           type: string
     *         description: Issuer fingerprint.
     *     responses:
     *       200:
     *         description: OpenBadges v2 BadgeClass JSON.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    bindWebService("/badge/class/*", badgeClass);

    /**
     * @openapi
     * /api/badge/assertion/{id}:
     *   get:
     *     tags:
     *       - OpenBadges Adapter
     *     summary: Get an OpenBadges v2 Assertion
     *     description: |
     *       Returns a hosted OpenBadges v2 Assertion for a CaSS assertion.
     *       Requires the badge adapter's key to be listed as a reader on the
     *       assertion in order to decrypt subject and agent information.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: CaSS assertion GUID.
     *     responses:
     *       200:
     *         description: OpenBadges v2 Assertion JSON.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       401:
     *         description: Not authorized — badge adapter key is not a reader on the assertion.
     *       404:
     *         description: Assertion not found.
     */
    bindWebService("/badge/assertion/*", badgeAssertion);
}


