const adminCache = [];

module.exports = {

    addPublicKeyToKnownAdmins: (pk) => {
        
        if (typeof pk != "string") {
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAdminCacheEntry", `Invalid key: ${typeof pk} was not a string`);
            return;
        }
        
        if (adminCache.includes(pk)) {
            return;
        }

        adminCache.push(pk);        
    },
    
    getKnownUserAdminPks: () => {
        return adminCache;
    }
};