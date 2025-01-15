const rxjs = require('rxjs');

const events = global.events = {};

events.database = {
    connected: new rxjs.BehaviorSubject(false),
    periodic: rxjs.interval(60000),
    afterSave: new rxjs.Subject(),
};
events.server = {
    init: new rxjs.Subject(),
    listening: new rxjs.BehaviorSubject(false),
    periodic: rxjs.interval(60000),
};
events.person = {
    doPing: (ppks) => {
        if (ppks == null) return;
        EcArray.setAdd(events.person.activePeople, JSON.stringify(ppks));
        events.person.arrived.next(events.person.activePeople.map((ppks) => JSON.parse(ppks)));
    },
    activePeople: [],
    arrived: new rxjs.BehaviorSubject([]),
    assertionAbout: new rxjs.Subject(),
};
events.data = {
    read: new rxjs.Subject(),
    write: new rxjs.Subject(),
    delete: new rxjs.Subject(),
    found: new rxjs.Subject(),
    any: new rxjs.Subject(),
}

events.person.arrived.subscribe(async (people) => {
    console.log(people);
});