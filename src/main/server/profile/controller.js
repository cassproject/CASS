let going = false;
console.log("Loading auto profile calculator.");
global.events.server.periodic.subscribe(async (activePeople) => {
    console.log("Auto-calculating profiles.");
    if (going) return;
    try {
        going = true;
        for (let keys of global.events.person.activePeople) {
            let eim = new EcIdentityManager();
            keys = JSON.parse(keys);
            for (let key of keys) {
                let i = new EcIdentity();
                i.ppk = EcPpk.fromPem(key);
                i.displayName = "Identity from Controller";
                eim.ids.push(i);
            }
            let frameworks = await EcFramework.search(repo, "*", null, null, { size: 10000 }, eim);
            let people = await EcPerson.search(repo, "*", null, null, { size: 10000 }, eim);
            for (let person of people)
                Promise.map(frameworks, async (framework) => {
                    await global.calculateProfile.call({
                        params: {
                            subject: person.owner[0],
                            frameworkId: framework.shortId(),
                            cache: "true",
                        },
                        ctx: {
                            req: {
                                eim: eim,
                            },
                        },
                    });
                }, {concurrency: 5});
        }
    } finally {
        going = false;
    }
});