var SearchController = function() {};
SearchController = stjs.extend(SearchController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.getTypes = function(success, failure) {
        this.repo.listTypes(success, failure);
    };
    prototype.search = function(query, success, failure, paramObj) {
        if (paramObj == null) 
            paramObj = new Object();
        var params = new Object();
        var paramProps = (params);
        if ((paramObj)["start"] != null) 
            paramProps["start"] = (paramObj)["start"];
        if ((paramObj)["size"] != null) 
            paramProps["size"] = (paramObj)["size"];
        if ((paramObj)["types"] != null) 
            paramProps["types"] = (paramObj)["types"];
        if ((paramObj)["ownership"] != null) {
            var ownership = (paramObj)["ownership"];
            if (!query.startsWith("(") || !query.endsWith(")")) {
                query = "(" + query + ")";
            }
            if (ownership.equals("public")) {
                query += " AND (_missing_:@owner)";
            } else if (ownership.equals("owned")) {
                query += " AND (_exists_:@owner)";
            } else if (ownership.equals("me")) {
                query += " AND (";
                for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                    if (i != 0) {
                        query += " OR ";
                    }
                    var id = EcIdentityManager.ids[i];
                    query += "@owner:\"" + id.ppk.toPk().toPem() + "\"";
                }
                query += ")";
            }
        }
        if ((paramObj)["fields"] != null) 
            paramProps["fields"] = (paramObj)["fields"];
        if (paramProps["start"] != null || paramProps["size"] != null || paramProps["ownership"] != null || paramProps["types"] != null || paramProps["fields"] != null) 
            this.repo.searchWithParams(query, params, null, success, failure);
         else 
            this.repo.search(query, null, success, failure);
    };
    prototype.searchWithParams = function(query, params, success, failure) {
        this.repo.searchWithParams(query, params, null, success, failure);
    };
    prototype.fileSearch = function(query, searchPublic, success, failure) {
        var queryAdd = "";
        if (searchPublic) 
            queryAdd = "(@type:*file OR @encryptedType:*file)";
         else 
            queryAdd = "(@encryptedType:*file)";
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.repo.search(query, null, success, failure);
    };
    prototype.competencySearch = function(query, success, failure, ownership) {
        var queryAdd = "";
        queryAdd = "(@type:\"" + EcCompetency.myType + "\")";
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        var params = new Object();
        (params)["ownership"] = ownership;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var comp = new EcCompetency();
                    comp.copyFrom(p1[i]);
                    ret[i] = comp;
                }
                success(ret);
            }
        }, failure, params);
    };
    prototype.frameworkSearch = function(query, success, failure, ownership) {
        var queryAdd = "";
        queryAdd = "(@type:\"" + EcFramework.myType + "\")";
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        var params = new Object();
        (params)["ownership"] = ownership;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var framework = new EcFramework();
                    framework.copyFrom(p1[i]);
                    ret[i] = framework;
                }
                success(ret);
            }
        }, failure, params);
    };
    prototype.relationSearchBySource = function(sourceId, success, failure) {
        var query = "";
        query = "(@type:\"" + EcAlignment.myType + "\")";
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(sourceId);
        if (noVersion == sourceId) {
            query += " AND (source:\"" + sourceId + "\")";
        } else {
            query += " AND (source:\"" + sourceId + "\" OR source:\"" + noVersion + "\")";
        }
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    alignment.copyFrom(p1[i]);
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure, null);
    };
    prototype.relationSearchBySourceOrTarget = function(competencyId, success, failure) {
        var query = "";
        query = "(@type:\"" + EcAlignment.myType + "\")";
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(competencyId);
        if (noVersion == competencyId) {
            query += " AND (source:\"" + competencyId + "\" OR target:\"" + competencyId + "\")";
        } else {
            query += " AND (source:\"" + competencyId + "\" OR source:\"" + noVersion + "\" OR target:\"" + competencyId + "\" OR target:\"" + noVersion + "\")";
        }
        var fields = ["source", "target", "relationType"];
        var params = new Object();
        (params)["fields"] = fields;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    alignment.copyFrom(p1[i]);
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure, params);
    };
}, {repo: "EcRepository"}, {});
