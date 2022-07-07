const fs = require('fs');
const os = require('os');
const busboy = require('busboy');
const getStream = require('get-stream');

//LEVR shims
if (global.fileLoad === undefined)
global.fileLoad = function(filepath){return fs.readFileSync(filepath);}

if (global.fileExists === undefined)
global.fileExists = function(filepath){return fs.existsSync(filepath);}

if (global.fileToString === undefined)
global.fileToString = function(file){
    if (file === undefined || file == null) return null;
    return file + "";
}

if (global.fileSave === undefined)
global.fileSave = function(text,filepath){fs.writeFileSync(filepath,text);}

if (global.bindWebService === undefined)
global.bindWebService = function(endpoint,callback){
    let get = async function(req,res){
        let ctx = {
            get: function(field){return ctx[field];},        
            put: function(field,value){ctx[field] = value;}
        }
        let ms = new Date().getTime();
        try{
            ctx.req = req;
            ctx.res = res;
            req.query.methodType = "GET";
            req.query.urlRemainder = req.params[0];
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetStart", `${endpoint} Request: ${JSON.stringify(req.query)}`, req.headers);
            var result = await callback.call({
                ctx:ctx,
                params: req.query
            });
            if (typeof(result) == "string")
            {
                try {
                    JSON.parse(result);
                    res.setHeader("Content-Type", "application/json; charset=utf-8");
                } catch(e) {
                    // not JSON
                }
                res.end(result);
            }
            else
                res.end(); 
        }
        catch (ex)
        {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetError", ex, `${endpoint} Request: ${JSON.stringify(req.query)}`, req.headers);
            if (ex && ex.status !== undefined && ex.status != null)
                res.status(ex.status);
            else
                res.status(500);
            res.end(ex && ex.data ? ex.data : ex +"");
        }
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetSuccess", `${endpoint} Response: (${(new Date().getTime() - ms)} ms) ${JSON.stringify(req.query)}`, req.headers);
    }    
    let put = async function(req,res){
        let ctx = {
            get: function(field){return ctx[field];},        
            put: function(field,value){ctx[field] = value;}
        }
        let ms = new Date().getTime();
        try{
            ctx.req = req;
            ctx.res = res;
            req.query.methodType = "PUT";
            req.query.urlRemainder = req.params[0];
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPutStart", `${endpoint} Request: ${JSON.stringify(req.query)}`, req.headers);
            var result = await callback.call({
                ctx:ctx,
                params: req.query
            });
            if (typeof(result) == "string")
            {
                res.end(result);
            }
            else
                res.end(); 
        }
        catch (ex)
        {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPutError", `${endpoint} Request: ${JSON.stringify(req.query)}`, req.headers);
            if (ex.status !== undefined && ex.status != null)
                res.status(ex.status);
            else
                res.status(500);
            res.end(ex.data ? ex.data : ex +"");
        }        
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPutSuccess", `${endpoint} Response: (${(new Date().getTime() - ms)} ms) ${JSON.stringify(req.query)}`, req.headers);
    } 
    let deleet = async function(req,res){
        let ctx = {
            get: function(field){return ctx[field];},        
            put: function(field,value){ctx[field] = value;}
        }
        let ms = new Date().getTime();
        try{
            ctx.req = req;
            ctx.res = res;
            req.query.methodType = "DELETE";
            req.query.urlRemainder = req.params[0];
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpDeleteStart", `${endpoint} Request: ${JSON.stringify(req.query)}`, req.headers);
            var result = await callback.call({
                ctx:ctx,
                params: req.query
            });
            if (typeof(result) == "string")
            {
                res.end(result);
            }
            else
                res.end(); 
        }
        catch (ex)
        {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpDeleteError", `${endpoint} Request: ${JSON.stringify(req.query)}`, req.headers);
            if (ex.status !== undefined && ex.status != null)
                res.status(ex.status);
            else
                res.status(500);
            res.end(ex.data ? ex.data : ex +"");
        }
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpDeleteSuccess", `${endpoint} Response: (${(new Date().getTime() - ms)} ms) ${JSON.stringify(req.query)}`, req.headers);
    }
    let post = async function(req,res){
        let ctx = {
            get: function(field){return ctx[field];},        
            put: function(field,value){ctx[field] = value;},
            req: req,
            res: res
        }
        let ms = new Date().getTime();
        try{
            const bb = busboy({ headers: req.headers,limits:{parts:100,fieldSize:52428800,fileSize:52428800}});
            req.query.methodType = "POST";
            req.query.urlRemainder = req.params[0];
            let fields = {};
            bb.on('file', (name, file, info) => {
                const { filename, encoding, mimeType } = info;
                fields[name || filename] = getStream(file);
            });
            bb.on('field', (name, val, info) => {
                fields[name] = val;
            });
            bb.on('close',async ()=>{
                try{
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostStart", "-----" + new Date() + " "+endpoint+ " " + (req.isSpdy ? "spdy" : req.httpVersion) + " Request: " + JSON.stringify(req.query) + " - Parts: " + JSON.stringify(EcObject.keys(fields)), req.headers, fields["signatureSheet"]);
                    for (let key in fields)
                        fields[key] = await fields[key];
                    var result = await callback.call({
                        ctx:ctx,
                        params: req.query,
                        dataStreams: fields
                    });
                    if (typeof(result) == "string")
                    {
                        res.end(result);
                    }
                    else
                        res.end();
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostSuccess", "-----" + new Date() + " "+endpoint+" Response: (" + (new Date().getTime() - ms) + " ms) " + JSON.stringify(req.query), req.headers, fields["signatureSheet"]);
                }
                catch (ex)
                {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostError", `${endpoint} ${(req.isSpdy ? "spdy" : req.httpVersion)} Request: ${JSON.stringify(req.query)} - Parts: ${JSON.stringify(EcObject.keys(fields))}`, req.headers, fields["signatureSheet"]);
                    if (ex.status !== undefined && ex.status != null)
                        res.status(ex.status);
                    else
                        res.status(500);
                    res.end(ex.data ? ex.data : ex +"");
                }
            });
            req.pipe(bb);
        }
        catch (ex)
        {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostError", ex);
            if (ex.status !== undefined && ex.status != null)
                res.status(ex.status);
            else
                res.status(500);
            res.end(ex.data ? ex.data : ex +"");
        }
        
    }
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassBindEndpoint", `Binding endpoint: /api${endpoint}`);
    app.get(baseUrl + '/api' + endpoint,get);
    app.post(baseUrl + '/api' + endpoint,post);
    app.put(baseUrl + '/api' + endpoint,put);
    app.delete(baseUrl + '/api' + endpoint,deleet);
}

if (global.fileFromDatastream === undefined)
global.fileFromDatastream = function(dataStream){
    if (this.dataStreams === undefined || this.dataStreams == null) return null;
    if ((dataStream === undefined||dataStream == null) && EcObject.keys(this.dataStreams).length == 1)
        return this.dataStreams[EcObject.keys(this.dataStreams)[0]];
    if (this.dataStreams[dataStream] === undefined || this.dataStreams[dataStream] == null) 
        return null;
    return this.dataStreams[dataStream];
};

if (global.headers === undefined)
global.headers = function(){return this.ctx.req.headers}

if (global.httpGet === undefined)
global.httpGet = async function(url, flag, headers)
{
    let failCounter = 0;
    while(failCounter++ < 1000)
    {
        try {
            const response = await axios.get(url, {headers: headers});
            if (skyrepoDebug)
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetSuccess", "get success: " + JSON.stringify(response.data));
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetSuccess", response.request.socket.remoteAddress, url);
            return response.data;
        } catch (error) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetError", error && error.response ? error.response.request.socket.remoteAddress : '', url, error);
            var resp = null;
            if (error != null)
                if (error.data != null)
                    resp = error.data;
            if (skyrepoDebug)
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetError", "get error: " + error, url);    
            if (skyrepoDebug) {
                if (resp != null)
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetError", resp);  
                else
                    if (error.response !== undefined && error.response.statusText !== undefined)
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetError", error.response.statusText);  
                    else
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetError", error.code);
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpGetError", resp); 
            }
            if (error.response != null)
            {
                if (error.response.status == 404 || error.response.status == 400)
                    return resp;
            }
        }
    }
}

if (global.debug === undefined)
global.debug = console.debug;

if (global.httpDelete === undefined)
global.httpDelete = async function(url,headers)
{    
    try {
        const response = await axios.delete(url, {headers: headers})
        if (skyrepoDebug)
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpDeleteSuccess", "delete success: " + JSON.stringify(response.data)); 
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpDeleteSuccess", response.request.socket.remoteAddress, url);
        return response.data;
    } catch (error) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpDeleteError", error && error.response ? error.response.request.socket.remoteAddress : '', url, error);
        var resp = null;
        if (error != null)
            if (error.data != null)
                resp = error.data;
        if (skyrepoDebug)
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpDeleteError", "delete error", url);
        if (skyrepoDebug) if (resp != null)
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpDeleteError", resp);
        return resp;
    }
}

if (global.httpPut === undefined)
global.httpPut = async function(data,url,contentType,headers)
{    
    try {
        const response = await axios.put(url,data,{
            headers: {
                'Content-Type':contentType,
                ...headers
            }
        })
        if (skyrepoDebug)
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPutSuccess", "put success: " + JSON.stringify(response.data)); 
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPutSuccess", response.request.socket.remoteAddress, url);
        return response.data;
    } catch (error) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPutError", error && error.response ? error.response.request.socket.remoteAddress: '', url, error);
        var resp = null;
        if (error != null)
            if (error.data != null)
                resp = error.data;
        if (skyrepoDebug)
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPutError", "put error", url);
        if (skyrepoDebug) if (resp != null)
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPutError", resp);
        return resp;
    }
}

if (global.httpPost === undefined)
global.httpPost = async function(data, url, contentType, multipart,something,something2,simple,headers){
    let failCounter = 0;
    while(failCounter++ < 1000)
    {
        try {
            const response = await axios.post(url,data,{
                headers: {
                    'Content-Type':contentType,
                    ...headers
                }
            })
            if (skyrepoDebug)
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostSuccess", "post success: " + JSON.stringify(response.data)); 
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostSuccess", response.request.socket.remoteAddress, url);
            return response.data;
        } catch (error) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostError", error && error.response ? error.response.request.socket.remoteAddress : '', url, error);
            var resp = null;
            if (error != null)
                if (error.data != null)
                    resp = error.data;
            if (skyrepoDebug)
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostError", "post error: " +error.response.status + ": "+ error.response.statusText, url);
            if (skyrepoDebug) 
                if (resp != null)
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostError", resp);
                else
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, "CassHttpPostError", error.response.statusText);
                    
            if (error.response != null)
            {
                if (error.response.status === 409) {
                    return 409;
                } else if (error.response.status == 404 || error.response.status == 400) {
                    return resp;
                }
            }
        }
    }
}

if (global.error === undefined)
global.error = function(errormessage,status){
    let e = {};
    e.data = errormessage;
    e.status = status;
    e.stack = new Error().stack;
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, "CassError", e);
    throw e;
}

if (global.randomString === undefined)
global.randomString = function(len){
    return forge.random.getBytesSync(len);
}

if (global.rsaGenerate === undefined)
global.rsaGenerate = function(len){
    return EcPpk.generateKey().toPem();
}

if (global.jsonLdExpand === undefined)
global.jsonLdExpand = function(json){
    return new Promise(async function(resolve,reject){
        try {
            let actual = await jsonld.expand(JSON.parse(json));
            resolve(actual);
        } catch (error) {
            reject((error)["message"]);
                    return;
        }
    });
}

if (global.jsonLdCompact === undefined)
global.jsonLdCompact = function(actual,finalTargetContext){
    return new Promise(async function(resolve,reject){
        try{finalTargetContext = JSON.parse(finalTargetContext)}catch(ex){}
        try {
            let o = await jsonld.compact(JSON.parse(actual), finalTargetContext);
            (o)["@context"] = finalTargetContext;
            resolve(o);
        } catch (s) {
            reject(s);
            return;
        }
    });
}

        // jsonld.expand(json, new Object(), function(error, actual) {
        //     if (error != null) {
        //         failure((error)["message"]);
        //         return;
        //     }
        //     jsonld.compact(actual, finalTargetContext, new Object(), function(s, o, o2) {
        //         if (s != null) {
        //             failure(s);
        //             return;
        //         }
        //         me.copyFrom(o);
        //         (me)["@context"] = finalTargetContext;
        //         success(me);
        //     });
        // });


const $rdf = require('rdflib');
if (global.jsonLdToRdfXml === undefined)
global.jsonLdToRdfXml = function(o){
    return new Promise(async function(resolve,reject){
        let rdf = await jsonld.toRDF(o, {format: 'application/n-quads'});
        let store = $rdf.graph();
        $rdf.parse(rdf, store, "whatever", 'application/n-quads',(err,str) => {
            resolve($rdf.serialize(null, str, '*', 'application/rdf+xml'));
        });
    });
}

if (global.jsonLdToTurtle === undefined)
global.jsonLdToTurtle = async function(o){
    return (await toTurtleInternal(o));
}

toTurtleInternal = function(o) {
    return new Promise(async function(resolve,reject){
        let rdf = await jsonld.toRDF(o, {format: 'application/n-quads'});
        let store = $rdf.graph();
        $rdf.parse(rdf, store, "whatever", 'application/n-quads',(err,str) => {
            let result = ($rdf.serialize(null, str, '*', 'text/turtle'));
            resolve(result);
        });
    });
}

if (global.jsonLdToNQuads === undefined)
global.jsonLdToNQuads = async function(o){
    return (await jsonld.toRDF(o, {format: 'application/n-quads'}));
}

//Shim to allow require of modules that are intended to be used to import.
require('module').Module._extensions['.js'] = function (module, filename) { 
  module._compile(require('fs').readFileSync(filename, 'utf8'), filename);
};
