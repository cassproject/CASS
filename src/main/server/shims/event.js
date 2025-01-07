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
