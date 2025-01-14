let going = false;
global.events.server.periodic.subscribe(async (activePeople) => {
    if (going) return;
    try{
        going = true;
        for (let keySet of activePeople)
        {
            global.calculateProfile.call({
                params:{},
                ctx:{req:{}}
            });
        }
    } finally {
        going = false;
    }
});