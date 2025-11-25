let going = false;
let keysIndex = 0;
let personIndex = 0;
let frameworksIndex = 0;

global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'ProfileControllerLoad', "Loading auto profile calculator.");
if (process.env.PROFILE_PPK != null)
{
    global.events.person.activePeople.push(JSON.stringify([process.env.PROFILE_PPK]));
}
let autoCalculatePeople = async ()=>{
    if (going) return;
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'ProfileControllerCompute', "Auto-calculating profiles.");
    try {
        going = true;
        for (keysIndex = 0;keysIndex < global.events.person.activePeople.length;keysIndex++) {
            let keys = global.events.person.activePeople[keysIndex];
            let eim = new EcIdentityManager();
            keys = JSON.parse(keys);
            for (let key of keys) {
                let i = new EcIdentity();
                i.ppk = EcPpk.fromPem(key);
                i.displayName = "Identity from Controller";
                eim.addIdentity(i);
            }
            let frameworks = await repo.multiget(events.data.frameworks, null,null,eim);
            let people = await EcPerson.search(repo, "*", null, null, { size: 10000 }, eim);
            for (personIndex = 0;personIndex < people.length;personIndex++) {
                let person = people[personIndex];
                await Promise.map(frameworks, async (framework) => {
                    try{
                        await global.calculateProfile.call({
                            params: {
                                subject: person.owner[0],
                                frameworkId: framework.shortId(),
                                autoComputed: true,
                                cache: "true",
                            },
                            ctx: {
                                req: {
                                    eim: eim,
                                },
                            },
                        });
                    }
                    catch (ex) {
                        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'ProfileControllerError', framework.shortId(), ex);
                    }
                }, { concurrency: 5 });
            }
        }
    } catch (ex) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'ProfileControllerError', ex);
    } finally {
        going = false;
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'ProfileControllerDone', "Done calculating profiles.");
    }
}

global.events.server.periodic.subscribe(async (activePeople) => {
    autoCalculatePeople();
});

global.events.person.arrived.subscribe(async (activePeople) => {
    keysIndex = 0;
    personIndex = 0;
    autoCalculatePeople();
});

let invalidateProfileByAssertion = async (data) => {
    let hasAssertion = false;
    let eim = null;
    let subjects = [];
    if (!EcArray.isArray(data)) data = [data];
    for (let datum of data) {
        datum = datum.object ? datum.object : datum;
        let d = new EcRemoteLinkedData().copyFrom(datum);
        if (d.type == "Assertion" || d.encryptedType == "Assertion") {
            hasAssertion = true;
            //Compile all identities and try to decrypt it.
            if (eim == null) {
                eim = new EcIdentityManager();
                for (let keys of global.events.person.activePeople) {
                    keys = JSON.parse(keys);
                    for (let key of keys) {
                        let i = new EcIdentity();
                        i.ppk = EcPpk.fromPem(key);
                        i.displayName = "Identity from Controller";
                        eim.addIdentity(i);
                    }
                }
            }
            let a = new EcAssertion().copyFrom(datum);
            let subject = await a.getSubject(eim);
            if (subject == null) {
                if (a.owner != null)
                    subjects.push(...a.owner);
                if (a.reader != null)
                    subjects.push(...a.reader);
            }
            else {
                subjects.push(subject.toPem());
            }
        }
    }
    if (hasAssertion) {
        EcArray.removeDuplicates(subjects);
        for (let subject of subjects) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'ProfileControllerInvalidating', "Deleting profiles associated with " + EcPk.fromPem(subject).fingerprint());
            global.ephemeral.deleteWith(`|${EcPk.fromPem(subject).fingerprint()}|`);
        }
    }
}

events.data.write.subscribe(invalidateProfileByAssertion);
events.data.delete.subscribe(invalidateProfileByAssertion);
