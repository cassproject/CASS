let going = false;
let keysIndex = 0;
let personIndex = 0;
let frameworksIndex = 0;
console.log("Loading auto profile calculator.");
if (process.env.PROFILE_PPK != null)
{
    global.events.person.activePeople.push(JSON.stringify([process.env.PROFILE_PPK]));
}
let autoCalculatePeople = async ()=>{
    console.log("Auto-calculating profiles.");
    if (going) return;
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
                eim.ids.push(i);
            }
            let frameworks = await repo.multiget(events.data.frameworks, eim);
            let people = await EcPerson.search(repo, "*", null, null, { size: 10000 }, eim);
            for (personIndex = 0;personIndex < people.length;personIndex++) {
                let person = people[personIndex];
                Promise.map(frameworks, async (framework) => {
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
                }, { concurrency: 5 });
            }
        }
    } finally {
        going = false;
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
        console.log(subjects);
        for (let subject of subjects) {
            console.log("Deleting profiles associated with " + EcPk.fromPem(subject).fingerprint());
            await global.ephemeral.deleteWith(`|${EcPk.fromPem(subject).fingerprint()}|`);
            keysIndex = 0;
            personIndex = 0;
            autoCalculatePeople();
        }
        // console.log("Frameworks", data, events.data.frameworks);
    }
}

events.data.write.subscribe(invalidateProfileByAssertion);
events.data.delete.subscribe(invalidateProfileByAssertion);
