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
};

events.person.arrived.subscribe(async (people) => {
    console.log(people);
});