badgeSetup = function () {
    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);

    if (EcRepository.repos == null || EcRepository.repos.length == 0) {
        //Permit find to work.
        var repo = new EcRepository();
        repo.selectedServer = repoEndpoint();
    }
    var identity = new EcIdentity();
    identity.ppk = EcPpk.fromPem(openbadgesPpk());
    identity.displayName = "OpenBadges Internal Identity";
    EcIdentityManager.addIdentity(identity);

}

badgeGetPerson = function (fingerprint) {
    var person = EcRepository.getBlocking(repoEndpoint() + "data/" + fingerprint);

    if (person.isAny(new EcEncryptedValue().getTypes())) {
        var v = new EcEncryptedValue();
        v.copyFrom(person);
        person = v.decryptIntoObject();
    }
    return person;
}

badgeCryptographicKey = function (fingerprint) {
    badgeSetup.call(this);
    if (fingerprint == null)
        fingerprint = this.params.urlRemainder.replace("/", "");
    var person = badgeGetPerson.call(this, fingerprint);
    if (person == null)
        error("Insufficient data available to generate cryptographic key.", 405);

    return JSON.stringify({
        "@context": "https://w3id.org/openbadges/v2",
        id: repoEndpoint() + "badge/cryptographicKey/" + fingerprint,
        type: "CryptographicKey",
        owner: repoEndpoint() + "data/" + fingerprint,
        publicKeyPem: person.publicKey
    });
};

badgeProfile = function (fingerprint) {
    badgeSetup.call(this);
    if (fingerprint == null)
        fingerprint = this.params.urlRemainder.replace("/", "");
    var person = badgeGetPerson.call(this, fingerprint);
    if (person == null)
        error("Insufficient data available to generate issuer.", 405);

    return JSON.stringify({
        "@context": "https://w3id.org/openbadges/v2",
        id: repoEndpoint() + "badge/profile/" + fingerprint,
        type: "Issuer",
        name: person.name,
        url: person.url == null ? (repoEndpoint() + "badge/profile/" + fingerprint) : person.url ,
        telephone: person.telephone,
        description: person.description,
        image: "https://api.badgr.io/public/badges/X7kb4H72TXiMoYN_kJNdEQ/image",
        email: person.email,
        publicKey: repoEndpoint() + "badge/cryptographicKey/" + fingerprint,
        verification: {
            type: "hosted"
        }
    })
};

badgeSubject = function (fingerprint) {
    badgeSetup.call(this);
    if (fingerprint == null)
        fingerprint = this.params.urlRemainder.replace("/", "");
    var person = badgeGetPerson.call(this, fingerprint);
    if (person == null)
        error("Insufficient data available to generate identityObject.", 405);

    if (person.email != null) {
        var sha = forge.md.sha256.create();
        var salt = EcAes.newIv(16);
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
        var salt = EcAes.newIv(16);
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
        var salt = EcAes.newIv(16);
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

badgeClass = function (competencyId, fingerprint, assertion) {
    badgeSetup.call(this);

    var competency = null;
    if (competencyId != null)
        competency = EcCompetency.getBlocking(competencyId);
    else {
        var query = queryParse.call(this);
        debug(query);
        competency = EcCompetency.getBlocking(repoEndpoint() + "data/" + query.type);
        fingerprint = query.id;
    }

    var competencyAlignment = new AlignmentObject();
    competencyAlignment.alignmentType = "requires";
    competencyAlignment.targetUrl = competency.id;
    competencyAlignment.targetName = competency.name;
    if (assertion != null)
        competencyAlignment.educationalFramework = assertion.framework;

    competencyId = repoEndpoint() + "badge/class/" + competency.getGuid() + "/" + fingerprint;
    if (EcRepository.shouldTryUrl(competency.id) == false) {
        var md5 = forge.md.md5.create();
        md5.update(competency.id);
        competencyId = repoEndpoint() + "badge/class/" + md5.digest().toHex() + "/" + fingerprint;
    }

    var criteria = {type:"Criteria"};
    if (competency.description != null)
        criteria.narrative = competency.description;
    else
        criteria.narrative = competency.getName();
    return JSON.stringify({
        "@context": "https://w3id.org/openbadges/v2",
        id: competencyId,
        type: "BadgeClass",
        issuer: repoEndpoint() + "badge/profile/" + fingerprint,
        name: competency.name,
        criteria: criteria,
        description: competency.description == null ? competency.name : competency.description,
        image: "https://api.badgr.io/public/badges/X7kb4H72TXiMoYN_kJNdEQ/image",
        alignment: [competencyAlignment]
    });
};

badgeAssertion = function () {
    badgeSetup.call(this);

    var query = queryParse.call(this);
    var assertion = EcRepository.getBlocking(repoEndpoint() + "data/" + query.id);
    if (assertion == null)
        error("Assertion not found.", 404);
    var a = new EcAssertion();
    a.copyFrom(assertion);

    var subject = a.getSubject();
    if (subject == null)
        error("Not authorized to perform this operation. Add the key found at /badge/pk to the assertion's @readers.", 401);
    var agent = a.getAgent();
    if (agent == null)
        error("Not authorized to perform this operation. Add the key found at /badge/pk to the assertion's @readers.", 401);
    subject = JSON.parse(badgeSubject(subject.fingerprint()));
    if (subject == null)
        error("Insufficient data available to generate badge recipient object.", 405);
    var clazz = JSON.parse(badgeClass(a.competency, agent.fingerprint(), a));
    if (clazz == null)
        error("Insufficient data available to generate badge class object.", 405);
    agent = JSON.parse(badgeProfile(agent.fingerprint()));
    if (agent == null)
        error("Insufficient data available to generate badge issuer object.", 405);

    var evidences = [];
    for (var i = 0; i < a.getEvidenceCount(); i++)
    {
        var evidence = a.getEvidence(i);
        if (evidence.toLowerCase().startsWith("http"))
                evidences.push(evidence);
        else if (EcObject.isObject(evidence))
                evidences.push(evidence);
        else
                evidences.push({type:"Evidence",narrative:evidence});
    }
    if (evidences.length == 1)
        evidences = evidences[0];
    var result = {
        "@context": "https://w3id.org/openbadges/v2",
        "id": repoEndpoint() + "badge/assertion/" + query.id,
        "type":"Assertion",
        "recipient": subject,
        "evidence": evidences,
"narrative": "This individual was claimed to have demonstrated this competency.",
        "image": "https://api.badgr.io/public/badges/X7kb4H72TXiMoYN_kJNdEQ/image",
        "issuedOn": new Date(a.getAssertionDate()).toISOString(),
        "expires": new Date(a.getExpirationDate()).toISOString(),
        "badge": clazz.id,
        "verification": {
            "type": "HostedBadge"
        }
    };
    //    result = bakeImage(result);
    return JSON.stringify(result);
}

openbadgeCheckId = function(){
	badgeSetup.call(this);

	var a = new EcAssertion();
	a.copyFrom(JSON.parse(this.params.obj));

	if (a.subject["@reader"] == null)
		return debug("Badge not generated for assertion: Assertion has no readers.");

	if (!EcArray.has(a.subject["@reader"],EcPpk.fromPem(openbadgesPpk()).toPk().toPem()) && !a.hasOwner(EcPpk.fromPem(openbadgesPpk()).toPk()))
		return debug("Badge not generated for assertion: Badge Adapter is not an owner nor reader.");

	if (repoEndpoint().contains("localhost"))
		return debug("Badge not generated for assertion: Endpoint Configuration is not set.");

	var subject = a.getSubject();
	if (subject == null)
		return debug("Badge not generated for assertion: No subject found.");
    var person = badgeGetPerson.call(this, subject.fingerprint());
    if (person == null)
        return debug("Badge not generated for assertion: Subject profile not found.");

    if (person.email == null)
    	return debug("Badge not generated for assertion: Profile does not contain email address.");

	badgeSendEmail({
		recipient: person.email,
		competencyName: EcRepository.getBlocking(a.competency).name,
		badgeId: repoEndpoint() + "badge/assertion/" + a.getGuid()
	});
}

bindWebService("/badge/profile", badgeProfile);
bindWebService("/badge/cryptographicKey", badgeCryptographicKey);
bindWebService("/badge/class", badgeClass);
bindWebService("/badge/assertion", badgeAssertion);