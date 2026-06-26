const fs = require('fs');
const nodePath = require('path');
const busboy = require('busboy');
const _getStream = require('get-stream');
const getStream = typeof _getStream === 'function'
    ? _getStream
    : (_getStream.default || _getStream.getStream);
// exposed for regression tests; the shim is otherwise loaded only for its global side effects.
module.exports.getStream = getStream;
const dns = require('dns').promises;

// LEVR shims
if (global.fileLoad === undefined) {
    global.fileLoad = function (filepath) {
        global.pathCheck(filepath);
        return fs.readFileSync(filepath);
    };
};

if (global.fileExists === undefined) {
    global.fileExists = function (filepath) {
        global.pathCheck(filepath);
        return fs.existsSync(filepath);
    };
};

if (global.fileToString === undefined) {
    global.fileToString = function (file) {
        if (file === undefined || file == null) return null;
        return file + '';
    };
};

global.postMaxSize = 52428800;
try {
    if (process.env.POST_MAX_SIZE != null) {
        global.postMaxSize = parseInt(process.env.POST_MAX_SIZE);
    }
} catch (e) {
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'PostMaxSize', 'Error setting POST max size from environment variable, using default value.', e);
}

if (global.fileSave === undefined) {
    global.fileSave = function (text, filepath) {
        global.pathCheck(filepath);
        fs.writeFileSync(filepath, text);
    };
};

if (global.bindWebService === undefined) {
    // Express 5: wildcard params are returned as arrays under the named key.
    // Join them back into a path string for legacy compatibility.
    // Return null (not '') when no wildcard was matched, so that endpoint
    // handlers that guard on `urlRemainder != null` continue to work.
    function getWildcardRemainder(params) {
        const remainder = params.splat;
        if (Array.isArray(remainder)) return remainder.join('/') || null;
        return remainder || null;
    }

    global.bindWebService = function (endpoint, callback) {
        let get = async function (req, res) {
            let ctx = {
                get: function (field) {
                    return ctx[field];
                },
                put: function (field, value) {
                    ctx[field] = value;
                },
            };
            let ms = new Date().getTime();
            try {
                ctx.req = req;
                ctx.res = res;
                // Express 5: req.query is a read-only getter. Build params separately.
                const params = { ...req.query, methodType: 'GET', urlRemainder: getWildcardRemainder(req.params) };
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.SERVICE, 'CassHttpGetStart', `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Request: ${JSON.stringify(params)}`, process.env.LOG_HEADERS ? req.headers : undefined);
                let result = await callback.call({
                    ctx: ctx,
                    params: params,
                });
                if (typeof (result) == 'string') {
                    try {
                        JSON.parse(result);
                        res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    } catch (e) {
                        // not JSON
                    }
                    res.end(result);
                } else {
                    res.end();
                }
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.SERVICE, 'CassHttpGetSuccess', `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Response: ${res.statusCode} (${(new Date().getTime() - ms)}ms${(result != null ? ', ' + ((result?.length / 1024).toFixed(0) + 'KB) ') : '')}) ${JSON.stringify(req.query)}`, process.env.LOG_HEADERS ? req.headers : undefined);
            } catch (ex) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'CassHttpGetError', ex, `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Request: ${JSON.stringify(req.query)}`, process.env.LOG_HEADERS ? req.headers : undefined);
                if (ex && ex.status !== undefined && ex.status != null) {
                    res.status(ex.status);
                } else {
                    res.status(500);
                }
                res.end(ex && ex.data ? ex.data : ex + '');
            }
        };
        let put = async function (req, res) {
            let ctx = {
                get: function (field) {
                    return ctx[field];
                },
                put: function (field, value) {
                    ctx[field] = value;
                },
            };
            let ms = new Date().getTime();
            try {
                ctx.req = req;
                ctx.res = res;
                // Express 5: req.query is a read-only getter. Build params separately.
                const params = { ...req.query, methodType: 'PUT', urlRemainder: getWildcardRemainder(req.params) };
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.SERVICE, 'CassHttpPutStart', `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Request: ${JSON.stringify(params)}`, process.env.LOG_HEADERS ? req.headers : undefined);
                req.setEncoding('utf8');
                req.body = '';
                req.on('data', function (chunk) {
                    req.body += chunk;
                });
                req.on('end', async function () {
                    let dataStreams = {};
                    if (req.body != '') {
                        dataStreams.body = JSON.parse(req.body);
                    }
                    let result = await callback.call({
                        ctx: ctx,
                        params: params,
                        dataStreams: dataStreams,
                    });
                    if (typeof (result) == 'string') {
                        try {
                            JSON.parse(result);
                            res.setHeader('Content-Type', 'application/json; charset=utf-8');
                        } catch (e) {
                            // not JSON
                        }
                        res.end(result);
                    } else {
                        res.end();
                    }
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.SERVICE, 'CassHttpPutSuccess', `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Response: ${res.statusCode} (${(new Date().getTime() - ms)}ms${(result != null ? ', ' + ((result?.length / 1024).toFixed(0) + 'KB) ') : '')}) ${JSON.stringify(req.query)}`, process.env.LOG_HEADERS ? req.headers : undefined);
                });
            } catch (ex) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'CassHttpPutError', ex, `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Request: ${JSON.stringify(req.query)}`, process.env.LOG_HEADERS ? req.headers : undefined);
                if (ex.status !== undefined && ex.status != null) {
                    res.status(ex.status);
                } else {
                    res.status(500);
                }
                res.end(ex.data ? ex.data : ex + '');
            }
        };
        let deleet = async function (req, res) {
            let ctx = {
                get: function (field) {
                    return ctx[field];
                },
                put: function (field, value) {
                    ctx[field] = value;
                },
            };
            let ms = new Date().getTime();
            try {
                ctx.req = req;
                ctx.res = res;
                // Express 5: req.query is a read-only getter. Build params separately.
                const params = { ...req.query, methodType: 'DELETE', urlRemainder: getWildcardRemainder(req.params) };
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.SERVICE, 'CassHttpDeleteStart', `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Request: ${JSON.stringify(params)}`, process.env.LOG_HEADERS ? req.headers : undefined);
                let result = await callback.call({
                    ctx: ctx,
                    params: params,
                });
                if (typeof (result) == 'string') {
                    try {
                        JSON.parse(result);
                        res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    } catch (e) {
                        // not JSON
                    }
                    res.end(result);
                } else {
                    res.end();
                }
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.SERVICE, 'CassHttpDeleteSuccess', `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Response: ${res.statusCode} (${(new Date().getTime() - ms)}ms) ${JSON.stringify(req.query)}`, process.env.LOG_HEADERS ? req.headers : undefined);
            } catch (ex) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'CassHttpDeleteError', ex, `${endpoint} ${req.isSpdy ? 'spdy' : req.httpVersion} Request: ${JSON.stringify(req.query)}`, process.env.LOG_HEADERS ? req.headers : undefined);
                if (ex.status !== undefined && ex.status != null) {
                    res.status(ex.status);
                } else {
                    res.status(500);
                }
                res.end(ex.data ? ex.data : ex + '');
            }
        };
        let post = async function (req, res) {
            let ctx = {
                get: function (field) {
                    return ctx[field];
                },
                put: function (field, value) {
                    ctx[field] = value;
                },
                req: req,
                res: res,
            };
            let ms = new Date().getTime();
            try {
                if (req.headers['content-type'] != null) {
                    req.headers['content-type'] = req.headers['content-type'].replace('multipart/mixed', 'multipart/form-data');
                }
                if (req.headers['content-type'] != null) {
                    if (req.headers['content-type'] == 'application/json') {
                        return await put(req, res);
                    }
                }
                const bb = busboy({ headers: req.headers, limits: { parts: 100, fieldSize: global.postMaxSize, fileSize: global.postMaxSize } });
                // Express 5: req.query is a read-only getter. Build params separately.
                const params = { ...req.query, methodType: 'POST', urlRemainder: getWildcardRemainder(req.params) };
                let fields = {};
                bb.on('file', (name, file, info) => {
                    const { filename, encoding, mimeType } = info;
                    fields[name || filename] = getStream(file, { encoding: 'binary' });
                });
                bb.on('field', (name, val, info) => {
                    fields[name] = val;
                });
                bb.on('close', async () => {
                    try {
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.SERVICE, 'CassHttpPostStart', endpoint + ' ' + (req.isSpdy ? 'spdy' : req.httpVersion) + ' Request: ' + JSON.stringify(params) + ' - Parts: ' + JSON.stringify(EcObject.keys(fields)), process.env.LOG_HEADERS ? req.headers : undefined);
                        for (let key in fields) {
                            fields[key] = await fields[key];
                        }
                        let result = await callback.call({
                            ctx: ctx,
                            params: params,
                            dataStreams: fields,
                        });
                        if (typeof (result) == 'string') {
                            try {
                                JSON.parse(result);
                                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                            } catch (e) {
                                // not JSON
                            }
                            res.end(result);
                        } else {
                            res.end();
                        }
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.SERVICE, 'CassHttpPostSuccess', endpoint + ` Response: ${res.statusCode} (` + (new Date().getTime() - ms) + 'ms' + (result != null ? ', ' + ((result?.length / 1024).toFixed(0) + 'KB') : '') + ') ' + JSON.stringify(req.query), process.env.LOG_HEADERS ? req.headers : undefined);
                    } catch (ex) {
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'CassHttpPostError', ex, `${endpoint} ${(req.isSpdy ? 'spdy' : req.httpVersion)} Request: ${JSON.stringify(req.query)} - Parts: ${JSON.stringify(EcObject.keys(fields))}`, process.env.LOG_HEADERS ? req.headers : undefined, ex.toString());
                        if (ex.status !== undefined && ex.status != null) {
                            res.status(ex.status);
                        } else {
                            res.status(500);
                        }
                        res.end(ex.data ? ex.data : ex + '');
                    }
                });
                req.pipe(bb);
            } catch (ex) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'CassHttpPostError', ex);
                if (ex.status !== undefined && ex.status != null) {
                    res.status(ex.status);
                } else {
                    res.status(500);
                }
                res.end(ex.data ? ex.data : ex + '');
            }
        };
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassBindEndpoint', `Binding endpoint: /api${endpoint}`);
        // Express 5 (path-to-regexp v8): bare * wildcards must be named.
        const e5Endpoint = endpoint.replace(/\/\*$/, '/*splat');
        app.get(baseUrl + '/api' + e5Endpoint, get);
        app.post(baseUrl + '/api' + e5Endpoint, post);
        app.put(baseUrl + '/api' + e5Endpoint, put);
        app.delete(baseUrl + '/api' + e5Endpoint, deleet);
    };
};

if (global.fileFromDatastream === undefined) {
    global.fileFromDatastream = function (dataStream) {
        if (this.dataStreams === undefined || this.dataStreams == null) return null;
        if ((dataStream === undefined || dataStream == null) && EcObject.keys(this.dataStreams).length == 1) {
            return this.dataStreams[EcObject.keys(this.dataStreams)[0]];
        }
        if (this.dataStreams[dataStream] === undefined || this.dataStreams[dataStream] == null) {
            return null;
        }
        return this.dataStreams[dataStream];
    };
}

if (global.headers === undefined) {
    global.headers = function () {
        return this.ctx.req.headers;
    };
};

if (global.httpGet === undefined) {
    global.httpGet = async function (url, flag, headers) {
        let failCounter = 0;
        while (failCounter++ < 100) {
            let ip = '';
            try {
                ip = (await dns.lookup(new URL(url).hostname)).address;
            } catch (error) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "DNSLookup", url, error);
            }
            try {
                const response = await fetch(url, { headers: headers });
                let result = null;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    result = await response.json();
                } else {
                    result = await response.text();
                    try {
                        result = JSON.parse(result);
                    }
                    catch (ex) {
                        // Text is not json
                    }
                }
                if (!response.ok) {
                    throw {
                        data: result,
                        response: { status: response.status, statusText: response.statusText }
                    };
                }
                if (global.skyrepoDebug) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpGetSuccess', 'get success: ' + JSON.stringify(result));
                }
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpGetSuccess', ip, url);
                return result;
            } catch (error) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpGetError', ip, url, error);
                let resp = null;
                if (error != null) {
                    if (error.data != null) {
                        resp = error.data;
                    }
                }
                if (global.skyrepoDebug) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpGetError', 'get error: ' + error, url);
                }
                if (global.skyrepoDebug) {
                    if (resp != null) {
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpGetError', resp);
                    } else
                        if (error.response !== undefined && error.response.statusText !== undefined) {
                            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpGetError', error.response.statusText);
                        } else {
                            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpGetError', error.code);
                        }
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpGetError', resp);
                }
                if (error.response != null) {
                    if (error.response.status == 404 || error.response.status == 400) {
                        return resp;
                    }
                }
            }
            await new Promise(r => setTimeout(r, 100));
        }
    };
};

if (global.debug === undefined) {
    global.debug = console.debug;
}

if (global.httpDelete === undefined) {
    global.httpDelete = async function (url, headers) {
        let ip = '';
        try {
            ip = (await dns.lookup(new URL(url).hostname)).address;
        } catch (error) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "DNSLookup", url, error);
        }
        try {
            const response = await fetch(url, { headers: headers, method: 'DELETE' });
            let result = null;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                result = await response.json();
            } else {
                result = await response.text();
                try {
                    result = JSON.parse(result);
                }
                catch (ex) {
                    // Text is not json
                }
            }
            if (!response.ok) {
                throw {
                    data: result,
                    response: { status: response.status, statusText: response.statusText }
                };
            }
            if (global.skyrepoDebug) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpDeleteSuccess', 'delete success: ' + JSON.stringify(response.data));
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpDeleteSuccess', ip, url);
            return result;
        } catch (error) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpDeleteError', ip, url, error);
            let resp = null;
            if (error != null) {
                if (error.data != null) {
                    resp = error.data;
                }
            }
            if (global.skyrepoDebug) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpDeleteError', 'delete error', url);
            }
            if (global.skyrepoDebug) {
                if (resp != null) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpDeleteError', resp);
                }
            }
            return resp;
        }
    };
};

if (global.httpPut === undefined) {
    global.httpPut = async function (data, url, contentType, headers) {
        let ip = '';
        try {
            ip = (await dns.lookup(new URL(url).hostname)).address;
        } catch (error) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "DNSLookup", url, error);
        }
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': contentType,
                    ...headers,
                },
                body: contentType === 'application/json' ? JSON.stringify(data) : data
            });
            let result = null;
            const _contentType = response.headers.get("content-type");
            if (_contentType && _contentType.indexOf("application/json") !== -1) {
                result = await response.json();
            } else {
                result = await response.text();
                try {
                    result = JSON.parse(result);
                }
                catch (ex) {
                    // Text is not json
                }
            }
            if (!response.ok) {
                throw {
                    data: result,
                    response: { status: response.status, statusText: response.statusText }
                };
            }
            if (global.skyrepoDebug) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPutSuccess', 'put success: ' + JSON.stringify(response.data));
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPutSuccess', ip, url);
            return result;
        } catch (error) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPutError', ip, url, error);
            let resp = null;
            if (error != null) {
                if (error.data != null) {
                    resp = error.data;
                }
            }
            if (global.skyrepoDebug) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPutError', 'put error', url);
            }
            if (global.skyrepoDebug) {
                if (resp != null) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPutError', resp);
                }
            }
            return resp;
        }
    };
};

if (global.httpPost === undefined) {
    global.httpPost = async function (data, url, contentType, multipart, something, something2, simple, headers) {
        let failCounter = 0;
        while (failCounter++ < 1000) {
            let ip = '';
            try {
                ip = (await dns.lookup(new URL(url).hostname)).address;
            } catch (error) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "DNSLookup", url, error);
            }
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': contentType,
                        ...headers,
                    },
                    body: contentType === 'application/json' ? JSON.stringify(data) : data
                });

                let result = null;
                const _contentType = response.headers.get("content-type");
                if (_contentType && _contentType.indexOf("application/json") !== -1) {
                    result = await response.json();
                } else {
                    result = await response.text();
                    try {
                        result = JSON.parse(result);
                    }
                    catch (ex) {
                        // Text is not json
                    }
                }
                if (!response.ok) {
                    throw {
                        data: result,
                        response: { status: response.status, statusText: response.statusText }
                    };
                }
                if (global.skyrepoDebug) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPostSuccess', 'post success: ' + JSON.stringify(response.data));
                }
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPostSuccess', ip, url);
                return result;
            } catch (error) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPostError', ip, url, error);
                let resp = null;
                if (error != null) {
                    if (error.data != null) {
                        resp = error.data;
                    }
                }
                if (global.skyrepoDebug) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPostError', 'post error: ' + error.response.status + ': ' + error.response.statusText, url);
                }
                if (global.skyrepoDebug) {
                    if (resp != null) {
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPostError', resp);
                    } else {
                        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.NETWORK, 'CassHttpPostError', error.response.statusText);
                    }
                }

                if (error.response != null) {
                    if (error.response.status === 409) {
                        return 409;
                    } else if (error.response.status == 404 || error.response.status == 400) {
                        return resp;
                    }
                }
            }
        }
    };
};

if (global.error === undefined) {
    global.error = function (errormessage, status) {
        let e = {};
        e.data = errormessage;
        e.status = status;
        e.stack = new Error().stack;
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'CassError', e);
        throw e;
    };
};

if (global.warn === undefined) {
    global.warn = function (errormessage, status) {
        let e = {};
        e.data = errormessage;
        e.status = status;
        e.stack = new Error().stack;
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'CassWarning', e);
    };
};

if (global.randomString === undefined) {
    global.randomString = function (len) {
        return forge.random.getBytesSync(len);
    };
};

if (global.rsaGenerate === undefined) {
    global.rsaGenerate = function (len) {
        return EcPpk.generateKey().toPem();
    };
};

if (global.jsonLdExpand === undefined) {
    global.jsonLdExpand = async function (json) {
        try {
            return await jsonld.expand(JSON.parse(json));
        } catch (error) {
            throw (error)['message'];
        }
    };
};

if (global.jsonLdCompact === undefined) {
    global.jsonLdCompact = async function (actual, finalTargetContext) {
        try {
            finalTargetContext = JSON.parse(finalTargetContext);
        } catch (ex) { }
        try {
            let o = await jsonld.compact(JSON.parse(actual), finalTargetContext);
            (o)['@context'] = finalTargetContext;
            return o;
        } catch (s) {
            throw s;
        }
    };
};

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
if (global.jsonLdToRdfXml === undefined) {
    global.jsonLdToRdfXml = function (o) {
        return new Promise(async function (resolve, reject) { // NOSONAR -- Blends async and callback, which needs direct promise access.
            let rdf = await jsonld.toRDF(o, { format: 'application/n-quads' });
            let store = $rdf.graph();
            $rdf.parse(rdf, store, 'whatever', 'application/n-quads', (err, str) => {
                resolve($rdf.serialize(null, str, '*', 'application/rdf+xml'));
            });
        });
    };
};

if (global.jsonLdToTurtle === undefined) {
    global.jsonLdToTurtle = async function (o) {
        return (await toTurtleInternal(o));
    };
};

toTurtleInternal = function (o) {
    return new Promise(async function (resolve, reject) { // NOSONAR -- Blends async and callback, which needs direct promise access.
        let rdf = await jsonld.toRDF(o, { format: 'application/n-quads' });
        let store = $rdf.graph();
        $rdf.parse(rdf, store, 'whatever', 'application/n-quads', (err, str) => {
            resolve($rdf.serialize(null, str, '*', 'text/turtle'));
        });
    });
};

if (global.jsonLdToNQuads === undefined) {
    global.jsonLdToNQuads = async function (o) {
        return (await jsonld.toRDF(o, { format: 'application/n-quads' }));
    };
};

// Shim to allow require of modules that are intended to be used to import.
require('module').Module._extensions['.js'] = function (module, filename) {
    module._compile(require('fs').readFileSync(filename, 'utf8'), filename);
};
