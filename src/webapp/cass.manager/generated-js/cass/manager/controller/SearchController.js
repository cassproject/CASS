var SearchController = function() {};
SearchController = stjs.extend(SearchController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.getTypes = function(success, failure) {
        this.repo.listTypes(success, failure);
    };
    prototype.search = function(query, success, failure, start, size, ownership, types) {
        var params = new Object();
        var paramProps = (params);
        if (start != null) 
            paramProps["start"] = start.intValue();
        if (size != null) 
            paramProps["size"] = size.intValue();
        if (ownership != null) 
            paramProps["ownership"] = ownership;
        if (types != null) 
            paramProps["types"] = types;
        if (paramProps["start"] != null || paramProps["size"] != null || paramProps["ownership"] != null || paramProps["ownership"] != null) 
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
        var paramProps = (params);
        if (ownership != null) 
            paramProps["ownership"] = ownership;
        if (paramProps["ownership"] != null) 
            this.repo.searchWithParams(query, params, null, success, failure);
         else 
            this.repo.search(query, null, success, failure);
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
        this.repo.search(query, null, success, failure);
    };
}, {repo: "EcRepository"}, {});
