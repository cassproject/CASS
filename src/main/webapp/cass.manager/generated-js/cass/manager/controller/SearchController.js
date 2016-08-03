/**
 *  Search Controller interfaces with the repository to build search queries based on
 *  the type of an object desired or other parameters that can be passed in
 *  
 *  @author devlin.junker@eduworks.com
 */
var SearchController = function() {};
SearchController = stjs.extend(SearchController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    /**
     *  Fetches an array of strings that identify the types present in the repository
     *  
     *  @param success
     *  			Callback when the list has been returned, hands the list back to the UI
     *  @param failure 
     *  			Callback if an error occurs while retrieving the types, returns the 
     *  			server response
     */
    prototype.getTypes = function(success, failure) {
        this.repo.listTypes(success, failure);
    };
    /**
     *  Very Basic Search, doesn't modify the query passed in except to wrap it in parenthesis
     *  
     *  @param query
     *  			The query to pass to ths search web service
     *  @param success 
     *  			Callback when the search successfully returns a list of objects found 
     *  			with the query
     *  @param failure 
     *  			Callback if an error occurs during the search, returns the server response
     *  			as a string
     *  @param paramObj 
     *  			Object with parameters to pass to the search web service (allowable
     *  			parameters include: start, size, types and ownership)
     */
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
    /**
     *  Searches for files that match the query passed in, if query is blank returns list of all 
     *  files up to the limit of returnable objects 
     *  
     *  @param query 
     *  			String to match files against
     *  @param searchPublic 
     *  			boolean flag to search for public files only
     *  @param success 
     *  			Callback to return the file objects found
     *  @param failure 
     *  			Callback to return any errors that occured during the file search
     */
    prototype.fileSearch = function(query, searchPublic, success, failure) {
        var queryAdd = "";
        queryAdd = new EcFile().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        if (searchPublic) {
            this.search(query, success, failure, null);
        } else {
            var params = new Object();
            (params)["ownership"] = "owned";
            this.search(query, success, failure, params);
        }
    };
    /**
     *  Searches for frameworks that match the query, if the query is blank returns list of all frameworks
     *  up to the limit of returnable objects
     *  
     *  @param query 
     *  			String to match frameworks against
     *  @param success 
     *  			Callback to return the frameworks found
     *  @param failure 
     *  			Callback to return any errors during search
     *  @param paramObj
     *  			Object containing search parameters (fields: start, size, ownership)
     */
    prototype.frameworkSearch = function(query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcFramework().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var framework = new EcFramework();
                    if (p1[i].isAny(framework.getTypes())) {
                        framework.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcFramework.myType)) {
                            var obj = val.decryptIntoObject();
                            framework.copyFrom(obj);
                            framework.privateEncrypted = true;
                        }
                    }
                    ret[i] = framework;
                }
                success(ret);
            }
        }, failure, paramObj);
    };
    /**
     *  Searches for competencies that match the query, if the query is blank returns list of all competencies
     *  up to the limit of returnable objects
     *  
     *  @param query 
     *  			String to match competencies against
     *  @param success 
     *  			Callback to return the competencies found
     *  @param failure 
     *  			Callback to return any errors during search
     *  @param paramObj
     *  			Object containing search parameters (fields: start, size, ownership)
     */
    prototype.competencySearch = function(query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcCompetency().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var comp = new EcCompetency();
                    if (p1[i].isAny(comp.getTypes())) {
                        comp.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcCompetency.myType)) {
                            var obj = val.decryptIntoObject();
                            comp.copyFrom(obj);
                            comp.privateEncrypted = true;
                        }
                    }
                    ret[i] = comp;
                }
                success(ret);
            }
        }, failure, paramObj);
    };
    /**
     *  Searches for the levels associated with a given competencyId, if competencyId is empty or
     *  null, failure is invoked
     *  
     *  @param competencyId 
     *  			Id of the competency to search for associated levels on
     *  @param success 
     *  			Callback to return the levels found
     *  @param failure 
     *  			Callback to return any errors during search
     */
    prototype.levelSearchByCompetency = function(competencyId, success, failure) {
        if (competencyId == null || competencyId == "") {
            failure("No Competency Specified");
            return;
        }
        var query = "(" + new EcLevel().getSearchStringByType();
        query += " AND ( competency:\"" + competencyId + "\" OR competency:\"" + EcRemoteLinkedData.trimVersionFromUrl(competencyId) + "\"))";
        query += " OR @encryptedType:\"" + EcLevel.myType + "\" OR @encryptedType:\"" + EcLevel.myType.replace(Cass.context + "/", "") + "\"";
        this.search(query, function(p1) {
            if (success != null) {
                var levels = [];
                for (var i = 0; i < p1.length; i++) {
                    var level = new EcLevel();
                    if (p1[i].isAny(level.getTypes())) {
                        level.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcLevel.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["competency"] != competencyId) {
                                continue;
                            }
                            level.copyFrom(obj);
                            level.privateEncrypted = true;
                        }
                    }
                    level.copyFrom(p1[i]);
                    levels[i] = level;
                }
                if (success != null) 
                    success(levels);
            }
        }, failure, null);
    };
    /**
     *  Searches for relations that match the query, if the query is blank returns list of all relations
     *  up to the limit of returnable objects
     *  
     *  @param query 
     *  			String to match relations against
     *  @param success 
     *  			Callback to return the relations found
     *  @param failure 
     *  			Callback to return any errors during search
     *  * @param paramObj
     *  			Object containing search parameters (fields: start, size, ownership)
     */
    prototype.relationSearch = function(query, success, failure, paramObj) {
        var queryAdd = new EcAlignment().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure, paramObj);
    };
    /**
     *  Searches for relationships that have the source competency specified by sourceId
     *  
     *  @param sourceId 
     *  			ID of the competency for which relationships are returned that contain this ID 
     *  			in the source field
     *  @param success 
     *  			Callback to return the relations found
     *  @param failure 
     *  			Callback to return any errors during search
     */
    prototype.relationSearchBySource = function(sourceId, success, failure) {
        var query = "";
        query = "(" + new EcAlignment().getSearchStringByType();
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(sourceId);
        if (noVersion == sourceId) {
            query += " AND (source:\"" + sourceId + "\"))";
        } else {
            query += " AND (source:\"" + sourceId + "\" OR source:\"" + noVersion + "\"))";
        }
        query += " OR @encryptedType:\"" + EcAlignment.myType + "\" OR @encryptedType:\"" + EcAlignment.myType.replace(Cass.context + "/", "") + "\")";
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["source"] != sourceId && (obj)["source"] != noVersion) {
                                continue;
                            }
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure, null);
    };
    /**
     *  Searches for relationships that have either the source or target competency specified 
     *  by competencyId
     *  
     *  @param competencyId 
     * 				ID of the competency for which relationships are returned that 
     *  			contain this ID in the source or target field
     *  @param success 
     *  			Callback to return the relations found
     *  @param failure 
     *  			Callback to return any errors during search
     */
    prototype.relationSearchBySourceOrTarget = function(competencyId, success, failure) {
        var query = "";
        query = "(" + new EcAlignment().getSearchStringByType();
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(competencyId);
        if (noVersion == competencyId) {
            query += " AND (source:\"" + competencyId + "\" OR target:\"" + competencyId + "\"))";
        } else {
            query += " AND (source:\"" + competencyId + "\" OR source:\"" + noVersion + "\" OR target:\"" + competencyId + "\" OR target:\"" + noVersion + "\"))";
        }
        query += " OR @encryptedType:\"" + EcAlignment.myType + "\" OR @encryptedType:\"" + EcAlignment.myType.replace(Cass.context + "/", "") + "\")";
        var fields = ["source", "target", "relationType"];
        var params = new Object();
        (params)["fields"] = fields;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["source"] != competencyId && (obj)["source"] != noVersion && (obj)["target"] != competencyId && (obj)["target"] != noVersion) {
                                continue;
                            }
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure, params);
    };
    /**
     *  Searches for assertion that match the query, if the query is blank returns list of all relations
     *  up to the limit of returnable objects
     *  
     *  @param query 
     *  			String to match assertion against
     *  @param success 
     *  			Callback to return the assertions found
     *  @param failure 
     *  			Callback to return any errors during search
     *  @param paramObj
     *  			Object containing search parameters (fields: start, size)
     */
    prototype.assertionSearch = function(query, success, failure, paramObj) {
        var queryAdd = new EcAssertion().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var assertion = new EcAssertion();
                    assertion.copyFrom(p1[i]);
                    ret[i] = assertion;
                }
                success(ret);
            }
        }, failure, paramObj);
    };
}, {repo: "EcRepository"}, {});
