var EcAnswer = function() {
    Answer.call(this);
};
EcAnswer = stjs.extend(EcAnswer, Answer, [], null, {parentItem: "Question", about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcPerson = function() {
    Person.call(this);
};
EcPerson = stjs.extend(EcPerson, Person, [], function(constructor, prototype) {
    constructor.getByPk = function(repo, pk, success, failure) {
        EcPerson.get(repo.selectedServer + (repo.selectedServer.endsWith("/") ? "" : "/") + "data/" + pk.fingerprint(), success, failure);
    };
    constructor.getByPkBlocking = function(repo, pk) {
        return EcPerson.getBlocking(repo.selectedServer + (repo.selectedServer.endsWith("/") ? "" : "/") + "data/" + pk.fingerprint());
    };
    prototype.equals = function(obj) {
        return this.isId((obj).id);
    };
    /**
     *  Retrieves a person from it's server asynchronously
     * 
     *  @param {String}            id
     *                             ID of the competency to retrieve from the server
     *  @param {Callback1<String>} success
     *                             Callback triggered after retrieving the person,
     *                             returns the person retrieved
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error retrieving person
     *  @memberOf EcPerson
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcPerson(), success, failure);
    };
    /**
     *  Retrieves a person from it's server synchronously, the call
     *  blocks until it is successful or an error occurs
     * 
     *  @param {String} id
     *                  ID of the person to retrieve
     *  @return EcPerson
     *  The person retrieved
     *  @memberOf EcPerson
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcPerson());
    };
    /**
     *  Searches a repository for persons that match the search query
     * 
     *  @param {EcRepository}          repo Repository to search using the query
     *  @param {String}                query Query string to pass to the search web service
     *  @param {Callback1<Array<Quiz>> success Callback triggered after
     *                                 completing the search, returns the results
     *  @param {Callback1<String>}     failure Callback triggered if error searching
     *  @param {Object}                paramObj Parameter object for search
     *  @memberOf EcPerson
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcPerson();
        }, success, failure, paramObj);
    };
    /**
     *  Attempts to find and return the person's fingerprint from the id.
     * 
     *  @return {String}
     *  @method getFingerprintFromId
     */
    prototype.getFingerprintFromId = function() {
        return this.getGuid();
    };
    /**
     *  Attempts to find and return the person's fingerprint from the id.
     * 
     *  @return {String}
     *  @method getFingerprintFromId
     */
    prototype.getFingerprint = function() {
        return this.getGuid();
    };
}, {address: "PostalAddress", spouse: "Person", funder: "Person", colleagues: "Person", memberOf: "Organization", height: "Distance", workLocation: "ContactPoint", netWorth: "PriceSpecification", children: "Person", hasOfferCatalog: "OfferCatalog", deathPlace: "Place", birthPlace: "Place", parents: "Person", alumniOf: "EducationalOrganization", homeLocation: "ContactPoint", makesOffer: "Offer", contactPoints: "ContactPoint", seeks: "Demand", sibling: "Person", performerIn: "Event", siblings: "Person", weight: "QuantitativeValue", contactPoint: "ContactPoint", hasPOS: "Place", parent: "Person", owns: "OwnershipInfo", affiliation: "Organization", sponsor: "Organization", brand: "Organization", nationality: "Country", relatedTo: "Person", follows: "Person", knows: "Person", worksFor: "Organization", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcCreativeWork = function() {
    CreativeWork.call(this);
};
EcCreativeWork = stjs.extend(EcCreativeWork, CreativeWork, [], function(constructor, prototype) {
    /**
     *  Retrieves a creative work from it's server asynchronously
     * 
     *  @param {String}            id
     *                             ID of the creative work to retrieve from the server
     *  @param {Callback1<String>} success
     *                             Callback triggered after retrieving the creative work,
     *                             returns the creative work retrieved
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error retrieving creative work
     *  @memberOf EcCreativeWork
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcCreativeWork(), success, failure);
    };
    /**
     *  Retrieves a creative work from it's server synchronously, the call
     *  blocks until it is successful or an error occurs
     * 
     *  @param {String} id
     *                  ID of the creative work to retrieve
     *  @return EcCreativeWork
     *  The creative work retrieved
     *  @memberOf EcCreativeWork
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcCreativeWork());
    };
    /**
     *  Searches a repository for creative works that match the search query
     * 
     *  @param {EcRepository}                    repo
     *                                           Repository to search using the query
     *  @param {String}                          query
     *                                           Query string to pass to the search web service
     *  @param {Callback1<Array<EcCreativeWork>> success
     *                                           Callback triggered after completing the search, returns the results
     *  @param {Callback1<String>}               failure
     *                                           Callback triggered if error searching
     *  @param {Object}                          paramObj
     *                                           Parameter object for search
     *  @memberOf EcCreativeWork
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcCreativeWork();
        }, success, failure, paramObj);
    };
}, {about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcQuiz = function() {
    CreativeWork.call(this);
    this.type = "Quiz";
    this.context = "http://schema.eduworks.com/0.1/";
};
EcQuiz = stjs.extend(EcQuiz, CreativeWork, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/0.1/Quiz";
    prototype.duration = null;
    prototype.question = null;
    /**
     *  Searches a repository for quizzes that match the search query
     * 
     *  @param {EcRepository}          repo Repository to search using the query
     *  @param {String}                query Query string to pass to the search web service
     *  @param {Callback1<Array<Quiz>> success Callback triggered after
     *                                 completing the search, returns the results
     *  @param {Callback1<String>}     failure Callback triggered if error searching
     *  @param {Object}                paramObj Parameter object for search
     *  @param start
     *  @param size
     *  @memberOf Quiz
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcQuiz();
        }, success, failure, paramObj);
    };
}, {question: {name: "Array", arguments: [null]}, about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcQuestion = function() {
    Question.call(this);
};
EcQuestion = stjs.extend(EcQuestion, Question, [], function(constructor, prototype) {
    constructor.MULTIPLE_CHOICE = "Multiple Choice";
    constructor.MULTIPLE_SELECT = "Multiple Select";
    constructor.SHORT_ANSWER = "Short Answer";
    constructor.FILL_IN_THE_BLANK = "Fill in the Blank";
    constructor.ESSAY_OR_SHORT_ANSWER = "Essay or Short Answer";
    constructor.HAND_GRADED_ESSAY = "Hand-graded Essay";
    /**
     *  Searches a repository for questions that match the search query
     * 
     *  @param {EcRepository}          repo Repository to search using the query
     *  @param {String}                query Query string to pass to the search web service
     *  @param {Callback1<Array<Quiz>> success Callback triggered after
     *                                 completing the search, returns the results
     *  @param {Callback1<String>}     failure Callback triggered if error searching
     *  @param {Object}                paramObj Parameter object for search
     *  @memberOf EcQuestion
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcQuestion();
        }, success, failure, paramObj);
    };
    /**
     *  Heuristic method of determining how this question should be asked.
     * 
     *  @return
     */
    prototype.getQuestionType = function() {
        var acceptedAnswers = this.acceptedAnswers();
        if (acceptedAnswers == null) {
            if (this.canEdit(EcIdentityManager.ids[0].ppk.toPk())) {
                return EcQuestion.HAND_GRADED_ESSAY;
            } else {
                return EcQuestion.ESSAY_OR_SHORT_ANSWER;
            }
        }
        var m = acceptedAnswers.length;
        if (m == 0) {
            return EcQuestion.HAND_GRADED_ESSAY;
        }
        if (this.suggestedAnswer == null) {
            if (this.text != null && this.text.indexOf("__") != -1) {
                return EcQuestion.FILL_IN_THE_BLANK;
            }
            return EcQuestion.SHORT_ANSWER;
        }
        var l = (this.suggestedAnswer).length;
        if (l == 0) {
            if (this.text != null && this.text.indexOf("__") != -1) {
                return EcQuestion.FILL_IN_THE_BLANK;
            }
            return EcQuestion.SHORT_ANSWER;
        }
        if (m > 1) {
            return EcQuestion.MULTIPLE_SELECT;
        }
        if (l > 0) {
            return EcQuestion.MULTIPLE_CHOICE;
        }
        return "Not sure.";
    };
    prototype.cementAnswerId = function(id) {
        if (this.acceptedAnswer != null) {
            if (!EcArray.isArray(this.acceptedAnswer)) {
                 throw new RuntimeException("Accepted Answer is not Array");
            }
            var ary = this.acceptedAnswer;
            for (var i = 0; i < ary.length; i++) {
                if (EcRemoteLinkedData.trimVersionFromUrl(ary[i]) == EcRemoteLinkedData.trimVersionFromUrl(id)) {
                    ary[i] = id;
                }
            }
        }
        if (this.suggestedAnswer != null) {
            if (!EcArray.isArray(this.suggestedAnswer)) {
                 throw new RuntimeException("Suggested Answer is not Array");
            }
            var ary = this.suggestedAnswer;
            for (var i = 0; i < ary.length; i++) {
                if (EcRemoteLinkedData.trimVersionFromUrl(ary[i]) == EcRemoteLinkedData.trimVersionFromUrl(id)) {
                    ary[i] = id;
                }
            }
        }
    };
    prototype.acceptedAnswers = function() {
        if (this.acceptedAnswer == null) {
            return new Array();
        }
        return this.acceptedAnswer;
    };
    prototype.suggestedAnswers = function() {
        if (this.suggestedAnswer == null) {
            return new Array();
        }
        return this.suggestedAnswer;
    };
    prototype.addAcceptedAnswer = function(answer) {
        if (this.acceptedAnswer == null) {
            (this)["acceptedAnswer"] = new Array();
        }
        if (!EcArray.isArray(this.acceptedAnswer)) {
             throw new RuntimeException("Accepted Answer is not Array");
        }
        var ary = this.acceptedAnswer;
        ary.push(answer.id);
    };
    prototype.addSuggestedAnswer = function(answer) {
        if (this.suggestedAnswer == null) {
            (this)["suggestedAnswer"] = new Array();
        }
        if (!EcArray.isArray(this.suggestedAnswer)) {
             throw new RuntimeException("Suggested Answer is not Array");
        }
        var ary = this.suggestedAnswer;
        ary.push(answer.id);
    };
    prototype.removeSuggestedAnswerById = function(id) {
        if (this.suggestedAnswer == null) {
            return;
        }
        if (!EcArray.isArray(this.suggestedAnswer)) {
             throw new RuntimeException("Suggested Answer is not Array");
        }
        var ary = this.suggestedAnswer;
        for (var i = 0; i < ary.length; i++) {
            if (EcRemoteLinkedData.trimVersionFromUrl(ary[i]) == EcRemoteLinkedData.trimVersionFromUrl(id)) {
                ary.splice(i, 1);
            }
        }
    };
    prototype.removeAcceptedAnswerById = function(id) {
        if (this.acceptedAnswer == null) {
            return;
        }
        if (!EcArray.isArray(this.acceptedAnswer)) {
             throw new RuntimeException("Accepted Answer is not Array");
        }
        var ary = this.acceptedAnswer;
        for (var i = 0; i < ary.length; i++) {
            if (EcRemoteLinkedData.trimVersionFromUrl(ary[i]) == EcRemoteLinkedData.trimVersionFromUrl(id)) {
                ary.splice(i, 1);
            }
        }
    };
}, {acceptedAnswer: "Answer", suggestedAnswer: "Answer", about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcOrganization = function() {
    Organization.call(this);
};
EcOrganization = stjs.extend(EcOrganization, Organization, [], function(constructor, prototype) {
    /**
     *  Retrieves an organization from it's server asynchronously
     * 
     *  @param {String}            id
     *                             ID of the concept to retrieve from the server
     *  @param {Callback1<String>} success
     *                             Callback triggered after retrieving the organization,
     *                             returns the organization retrieved
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error retrieving organization
     *  @memberOf EcOrganization
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcOrganization(), success, failure);
    };
    /**
     *  Retrieves an organization from it's server synchronously, the call
     *  blocks until it is successful or an error occurs
     * 
     *  @param {String} id
     *                  ID of the organization to retrieve
     *  @return EcOrganization
     *  The concept retrieved
     *  @memberOf EcOrganization
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcOrganization());
    };
    /**
     *  Searches a repository for organizations that match the search query
     * 
     *  @param {EcRepository}          repo Repository to search using the query
     *  @param {String}                query Query string to pass to the search web service
     *  @param {Callback1<Array<Quiz>> success Callback triggered after
     *                                 completing the search, returns the results
     *  @param {Callback1<String>}     failure Callback triggered if error searching
     *  @param {Object}                paramObj Parameter object for search
     *  @memberOf EcOrganization
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcOrganization();
        }, success, failure, paramObj);
    };
    /**
     *  Adds the given person's id to the employee list
     * 
     *  @param {EcPerson}          person Person to add to the Organization's employee list
     *  @method addEmployee
     */
    prototype.addEmployee = function(person) {
        if (this.employee == null) 
            (this)["employee"] = new Array();
        if (!EcArray.isArray(this.employee)) 
             throw new RuntimeException("Employee is not Array");
        var ary = this.employee;
        var psid = person.shortId();
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] == psid) 
                return;
        }
        ary.push(psid);
    };
    /**
     *  Removes the person id from the employee list
     * 
     *  @param {String}          id Person id to be removed from Organization's employee list
     *  @method removeEmployeeById
     */
    prototype.removeEmployeeById = function(id) {
        if (this.employee == null) 
            return;
        if (!EcArray.isArray(this.employee)) 
             throw new RuntimeException("Employee is not Array");
        var ary = this.employee;
        for (var i = 0; i < ary.length; i++) {
            if (EcRemoteLinkedData.trimVersionFromUrl(ary[i]) == EcRemoteLinkedData.trimVersionFromUrl(id)) {
                ary.splice(i, 1);
            }
        }
    };
    /**
     *  Moves all Person type Member to Employee
     * 
     *  @method movePersonMembersToEmployee
     */
    prototype.movePersonMembersToEmployee = function() {
        if (this.member == null) 
            return;
        if (this.employee == null) 
            (this)["employee"] = new Array();
        if (!EcArray.isArray(this.employee) || !EcArray.isArray(this.member)) 
            return;
        var membAry = this.member;
        var empAry = this.employee;
        var me = (this);
        for (var i = 0; i < membAry.length; i++) {
            var id = membAry[i];
            if (id.toLowerCase().indexOf("person") > -1) {
                if (empAry.indexOf(id) <= -1) {
                    empAry.push(id);
                }
                membAry.splice(i, 1);
            }
        }
    };
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        this.movePersonMembersToEmployee();
    };
    /**
     *  Attempts to find and return the organization's fingerprint from the id.
     * 
     *  @return {String}
     *  @method getFingerprintFromId
     */
    prototype.getFingerprintFromId = function() {
        return this.getGuid();
    };
    /**
     *  Attempts to find and return the organization's fingerprint from the id.
     * 
     *  @return {String}
     *  @method getFingerprintFromId
     */
    prototype.getFingerprint = function() {
        return this.getGuid();
    };
}, {serviceArea: "GeoShape", address: "PostalAddress", funder: "Person", memberOf: "Organization", subOrganization: "Organization", hasOfferCatalog: "OfferCatalog", reviews: "Review", members: "Organization", aggregateRating: "AggregateRating", makesOffer: "Offer", contactPoints: "ContactPoint", seeks: "Demand", member: "Organization", founders: "Person", alumni: "Person", events: "Event", logo: "ImageObject", employees: "Person", department: "Organization", contactPoint: "ContactPoint", parentOrganization: "Organization", employee: "Person", numberOfEmployees: "QuantitativeValue", hasPOS: "Place", review: "Review", foundingLocation: "Place", owns: "OwnershipInfo", event: "Event", founder: "Person", sponsor: "Organization", location: "PostalAddress", brand: "Organization", areaServed: "Place", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
