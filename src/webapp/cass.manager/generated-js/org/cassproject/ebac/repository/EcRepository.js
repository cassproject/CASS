var EcRepository = function() {};
EcRepository = stjs.extend(EcRepository, null, [], function(constructor, prototype) {
    prototype.selectedServer = null;
    /**
     *  Gets a JSON-LD object from the place designated by the URI.
     *  
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     *  
     *  @param url
     *             URL of the remote object.
     *  @param success
     *             Event to call upon successful retrieval.
     *  @param failure
     *             Event to call upon spectacular failure.
     */
    constructor.get = function(url, success, failure) {
        var fd = new FormData();
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(10000, url));
        EcRemote.postExpectingObject(url, null, fd, function(p1) {
            var d = new EcRemoteLinkedData("", "");
            d.copyFrom(p1);
            success(d);
        }, failure);
    };
    /**
     *  Search a repository for JSON-LD compatible data.
     *  
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     *  
     *  @param query
     *             ElasticSearch compatible query string, similar to Google query
     *             strings.
     *  @param eachSuccess
     *             Success event for each found object.
     *  @param success
     *             Success event, called after eachSuccess.
     *  @param failure
     *             Failure event.
     */
    prototype.search = function(query, eachSuccess, success, failure) {
        var fd = new FormData();
        fd.append("data", query);
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(10000, this.selectedServer));
        EcRemote.postExpectingObject(this.selectedServer, "sky/repo/search", fd, function(p1) {
            var results = p1;
            if (eachSuccess != null) 
                for (var i = 0; i < results.length; i++) 
                    eachSuccess(results[i]);
            if (success != null) 
                success(results);
        }, failure);
    };
    /**
     *  Attempts to save a piece of data.
     *  
     *  Uses a signature sheet informed by the owner field of the data.
     *  
     *  @param data
     *             Data to save to the location designated by its id.
     *  @param success
     *  @param failure
     */
    prototype.save = function(data, success, failure) {
        if (data.id == null) 
             throw new RuntimeException("Cannot save data that has no ID.");
        var fd = new FormData();
        fd.append("data", data.toJson());
        fd.append("signatureSheet", EcIdentityManager.signatureSheetFor(data.owner, 10000, data.id));
        EcRemote.postExpectingString(data.id, "", fd, success, failure);
    };
    prototype.update = function(data, success, failure) {
        EcRepository.get(data.id, success, failure);
    };
    prototype.sign = function(data, pen) {
        data.signature.push(EcRsaOaep.sign(pen, data.toSignableJson()));
    };
}, {}, {});
