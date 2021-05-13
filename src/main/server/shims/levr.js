const fs = require('fs');
const formidable = require('formidable');
const axios = require('axios');

//LEVR shims
if (global.fileLoad === undefined)
global.fileLoad = function(filepath){return fs.readFileSync(filepath);}

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
            console.log("-----" + new Date() + " "+endpoint+" Request: " + JSON.stringify(req.query));
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
            if (ex.status !== undefined && ex.status != null)
                res.status(ex.status);
            else
                res.status(500);
            res.end(ex+"");
            console.trace(ex);
        }
        console.log("-----" + new Date() + " "+endpoint+" Response: (" + (new Date().getTime() - ms) + " ms) GET " + JSON.stringify(req.query));
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
            console.log("-----" + new Date() + " "+endpoint+" Request: " + JSON.stringify(req.query));
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
            if (ex.status !== undefined && ex.status != null)
                res.status(ex.status);
            else
                res.status(500);
            res.end(ex+"");
            console.trace(ex);
        }        
        console.log("-----" + new Date() + " "+endpoint+" Response: (" + (new Date().getTime() - ms) + " ms) " + JSON.stringify(req.query));
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
            console.log("-----" + new Date() + " "+endpoint+" Request: " + JSON.stringify(req.query));
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
            if (ex.status !== undefined && ex.status != null)
                res.status(ex.status);
            else
                res.status(500);
            res.end(ex+"");
            console.trace(ex);
        }
        console.log("-----" + new Date() + " "+endpoint+" Response: (" + (new Date().getTime() - ms) + " ms) " + JSON.stringify(req.query));
    }
    let post = async function(req,res){
        let ctx = {
            get: function(field){return ctx[field];},        
            put: function(field,value){ctx[field] = value;}
        }
        let ms = new Date().getTime();
        new formidable.IncomingForm().parse(req, async (err, fields, files) => {
            try{
                ctx.req = req;
                ctx.res = res;
                req.query.methodType = "POST";
                req.query.urlRemainder = req.params[0];
                console.log("-----" + new Date() + " "+endpoint+" Request: " + JSON.stringify(req.query) + " - Parts: " + JSON.stringify(EcObject.keys(fields)));
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
            }
            catch (ex)
            {
                if (ex.status !== undefined && ex.status != null)
                    res.status(ex.status);
                else
                    res.status(500);
                res.end(ex+"");
                console.trace(ex);
            }
        console.log("-----" + new Date() + " "+endpoint+" Response: (" + (new Date().getTime() - ms) + " ms) " + JSON.stringify(req.query));
        })
    }
    console.log("Binding endpoint: /api" + endpoint)
    app.get('/api'+endpoint,get);
    app.post('/api'+endpoint,post);
    app.put('/api'+endpoint,put);
    app.delete('/api'+endpoint,deleet);
    app.get('/cass/api'+endpoint,get);
    app.post('/cass/api'+endpoint,post);
    app.put('/cass/api'+endpoint,put);
    app.delete('/cass/api'+endpoint,deleet);
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
global.httpGet = async function(url)
{    
    try {
        const response = await axios.get(url)
        if (skyrepoDebug) console.log("get success: " + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        var resp = null;
        if (error != null)
            if (error.data != null)
                resp = error.data;
        if (skyrepoDebug) console.trace("get error" + error);
        if (skyrepoDebug) console.error(url);
        if (skyrepoDebug) {if (resp != null)
            console.error(resp);
        else
            if (error.response !== undefined && error.response.statusText !== undefined)
                console.error(error.response.statusText); 
            else
                console.error(error.code);
            console.error(resp);
        }
        return resp;
    }
}

if (global.debug === undefined)
global.debug = console.debug;

if (global.httpDelete === undefined)
global.httpDelete = async function(url)
{    
    try {
        const response = await axios.delete(url)
        if (skyrepoDebug) console.log("delete success: " + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        var resp = null;
        if (error != null)
            if (error.data != null)
                resp = error.data;
        if (skyrepoDebug) console.trace("delete error");
        if (skyrepoDebug) console.error(url);
        if (skyrepoDebug) if (resp != null)
            console.error(resp);
        else
            console.error(error.response.statusText);
        return resp;
    }
}

if (global.httpPut === undefined)
global.httpPut = async function(data,url,contentType)
{    
    try {
        const response = await axios.put(url,data,{
            headers: {
                'Content-Type':contentType
            }
        })
        if (skyrepoDebug) console.log("put success: " + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        var resp = null;
        if (error != null)
            if (error.data != null)
                resp = error.data;
        if (skyrepoDebug) console.trace("put error");
        if (skyrepoDebug) console.error(url);
        if (skyrepoDebug) if (resp != null)
            console.error(resp);
        else
            console.error(error.response.statusText);
        return resp;
    }
}

if (global.httpPost === undefined)
global.httpPost = async function(data, url, contentType, multipart,something,something2,simple){
    try {
        const response = await axios.post(url,data,{
            headers: {
                'Content-Type':contentType
            }
        })
        if (skyrepoDebug) console.log("post success: " + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        var resp = null;
        if (error != null)
            if (error.data != null)
                resp = error.data;
        if (skyrepoDebug) 
            console.trace("post error: " +error.response.status + ": "+ error.response.statusText);
        if (skyrepoDebug) 
            console.error(url);
        if (skyrepoDebug) 
            if (resp != null)
                console.error(resp);
            else
                console.error(error.response.statusText);
        return resp;
    }
}

if (global.error === undefined)
global.error = function(errormessage,status){
    errormessage.status = status;
    console.trace(errormessage);
    throw errormessage;
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
    return new Promise(function(resolve,reject){
        jsonld.expand(JSON.parse(json), new Object(), function(error, actual) {
            if (error != null) {
                reject((error)["message"]);
                return;
            }
            resolve(actual);
        });
    });
}

if (global.jsonLdCompact === undefined)
global.jsonLdCompact = function(actual,finalTargetContext){
    return new Promise(function(resolve,reject){
        try{finalTargetContext = JSON.parse(finalTargetContext)}catch(ex){}
        jsonld.compact(JSON.parse(actual), finalTargetContext, new Object(), function(s, o, o2) {
            if (s != null) {
                reject(s);
                return;
            }            
            (o)["@context"] = finalTargetContext;
            resolve(o);
        });
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
    return new Promise(function(resolve,reject){
        let uri = JSON.parse(o)["@id"];
        let store = $rdf.graph();
        $rdf.parse(o, store, "whatever", 'application/ld+json',(err,str) => {
            resolve($rdf.serialize(null, str, '*', 'application/rdf+xml'));
        });
    });
}

//Shim to allow require of modules that are intended to be used to import.
require('module').Module._extensions['.js'] = function (module, filename) { 
  module._compile(require('fs').readFileSync(filename, 'utf8'), filename);
};
const rdfjson = require('@entryscape/rdfjson')
if (global.jsonLdToRdfJson === undefined)
global.jsonLdToRdfJson = async function(o){
    let rdfxml = await jsonLdToRdfXml(o);
      const { rdfxml2graph } = rdfjson.converters;
      const graph = rdfxml2graph(rdfxml);
      const jsonrdf = graph.exportRDFJSON();
      return JSON.stringify(jsonrdf, null, 2);
}

