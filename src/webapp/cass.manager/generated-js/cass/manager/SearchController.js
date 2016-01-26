var SearchController = function() {};
SearchController = stjs.extend(SearchController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.search = function(query) {
        this.repo.search(query, null, function(p1) {
            addTilesToSearchResults(p1);
        }, function(p1) {
            searchError(p1);
        });
    };
    prototype.fileSearch = function(query) {
        var queryAdd = "";
        if (fileManagerSearchesPublic) 
            queryAdd = "(@type:*file OR @encryptedType:*file)";
         else 
            queryAdd = "(@encryptedType:*file)";
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.repo.search(query, null, function(p1) {
            addTilesToFileSearchResult(p1);
        }, function(p1) {
            searchError(p1);
        });
    };
}, {repo: "EcRepository"}, {});
