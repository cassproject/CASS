
if (!String.prototype.startsWith) {
	String.prototype.startsWith=function(start, from){
		var f = from != null ? from : 0;
		return this.substring(f, f + start.length) == start;
	}
}
/** exception **/
global.Throwable = function(message, cause){
	Error.call(this);
	if(typeof Error.captureStackTrace === 'function'){
		// nice way to capture the stack trace for chrome
		Error.captureStackTrace(this, arguments.callee);
	} else {
		// alternate way to capture the stack trace for other browsers
		try{
			throw new Error();
		}catch(e){
			this.stack = e.stack;
		}
	}
	if (typeof message === "string"){
		this.detailMessage  = message;
		this.message = message;
		this.cause = cause;
	} else {
		this.cause = message;
	}
};
stjs.extend(Throwable, Error, [], function(constructor, prototype){
	prototype.detailMessage = null;
	prototype.cause = null;
	prototype.getMessage = function() {
        return this.detailMessage;
    };

	prototype.getLocalizedMessage = function() {
        return this.getMessage();
    };

	prototype.getCause = function() {
        return (this.cause==this ? null : this.cause);
    };

	prototype.toString = function() {
	        var s = "Exception";//TODO should get the exception's type name here
	        var message = this.getLocalizedMessage();
	        return (message != null) ? (s + ": " + message) : s;
	 };

	 prototype.getStackTrace = function() {
		 return this.stack;
	 };

	 prototype.printStackTrace = function(){
		 console.error(this.getStackTrace());
	 };
}, {});

global.Exception = function(message, cause){
	Throwable.call(this, message, cause);
};
stjs.extend(Exception, Throwable, [], function(constructor, prototype){
}, {});

global.RuntimeException = function(message, cause){
	Exception.call(this, message, cause);
};
stjs.extend(RuntimeException, Exception, [], function(constructor, prototype){
}, {});

stjs.JavalikeEquals = function(value){
	if (value == null)
		return false;
	if (value.valueOf)
		return this.valueOf() === value.valueOf();
	return this === value;
};

stjs.JavalikeGetClass = function(){
	return this.constructor;
};

/* String */
if (!String.prototype.equals) {
	String.prototype.equals=stjs.JavalikeEquals;
}