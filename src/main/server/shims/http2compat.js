/*
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2026 Eduworks Corporation and other contributing parties.
 * -----
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --END_LICENSE--
 */

'use strict';

/**
 * HTTP/2-to-Express 4 compatibility shim.
 *
 * Node's native http2 compatibility API (Http2ServerRequest / Http2ServerResponse)
 * does not work reliably with Express 4, which was built around standard
 * http.IncomingMessage and http.ServerResponse objects.
 *
 * This shim creates an HTTP/2 secure server that:
 *   - Handles HTTP/1.1 connections via the built-in allowHTTP1 fallback (Express
 *     works natively with those).
 *   - Intercepts HTTP/2 streams BEFORE Node's compatibility layer can create
 *     the problematic Http2ServerRequest/Http2ServerResponse objects.
 *   - Creates real http.IncomingMessage + http.ServerResponse instances from
 *     the HTTP/2 stream data, so Express 4 sees fully-compatible objects.
 *
 * Inspired by the approach used in the now-unmaintained spdy-fixes package.
 * Portions adapted from spdy-fixes (MIT, Fedor Indutny / Beeno Tung).
 */

const http2 = require('node:http2');
const http = require('node:http');
const net = require('node:net');

// ---- Socket proxy ----

/**
 * TLS method names that should be proxied from the HTTP/2 session's
 * real TLS socket to the per-stream fake socket.
 */
const TLS_METHODS = [
    'getPeerCertificate',
    'getCipher',
    'getSession',
    'isSessionReused',
    'getEphemeralKeyInfo',
    'renegotiate',
    'setMaxSendFragment',
    'getTLSTicket',
    'setServername',
    'setSession',
];

/**
 * A net.Socket stand-in that wraps a single HTTP/2 stream.
 *
 * Express (and Node's http.IncomingMessage / http.ServerResponse) expect a
 * socket with readable/writable properties, TLS accessors, and the usual
 * address fields.  This class satisfies those contracts by proxying reads
 * from the HTTP/2 stream and TLS methods from the session's real socket.
 */
class Http2SocketProxy extends net.Socket {
    constructor(stream, session) {
        // Construct with handle:null — we won't be doing real I/O through the
        // net.Socket machinery.  Setting readable/writable to false prevents
        // the parent constructor from trying to read/write on a missing handle.
        super({readable: false, writable: false});

        this._h2stream = stream;
        this._h2session = session;
        this._parentSocket = session.socket; // the actual TLS socket

        // In Node 24+ many net.Socket / tls.TLSSocket properties are
        // getter-only.  We must use Object.defineProperty to override them.
        const props = {
            readable:           true,
            writable:           true,
            encrypted:          true,
            authorized:         this._parentSocket.authorized,
            authorizationError: this._parentSocket.authorizationError,
            remoteAddress:      this._parentSocket.remoteAddress,
            remotePort:         this._parentSocket.remotePort,
            remoteFamily:       this._parentSocket.remoteFamily,
            localAddress:       this._parentSocket.localAddress,
            localPort:          this._parentSocket.localPort,
            servername:         this._parentSocket.servername,
            alpnProtocol:       this._parentSocket.alpnProtocol,
            server:             null, // set by createServer
        };
        for (const [key, val] of Object.entries(props)) {
            Object.defineProperty(this, key, {
                value: val, writable: true, configurable: true, enumerable: true,
            });
        }
    }

    /* --- Readable side (data already pushed externally) --- */
    _read() { /* no-op: data is pushed via push() from stream events */ }

    /* --- Writable side (forwards to the HTTP/2 stream) --- */
    _write(chunk, encoding, cb) {
        if (this._h2stream.destroyed) return cb();
        this._h2stream.write(chunk, encoding, cb);
    }

    _final(cb) {
        // Stream lifecycle is managed by the res.end() interceptor in
        // _dispatchHttp2Stream, which gates on request body completion.
        // Do NOT end the H2 stream here.
        cb();
    }

    /* --- Stubs expected by IncomingMessage / ServerResponse --- */
    setKeepAlive() { return this; }
    setNoDelay() { return this; }
    setTimeout(ms, cb) {
        if (this._h2stream && !this._h2stream.destroyed) {
            this._h2stream.setTimeout(ms, cb);
        }
        return this;
    }
    ref() { return this; }
    unref() { return this; }

    destroy(err) {
        // Do NOT destroy the H2 stream here. Express / ServerResponse
        // calls socket.destroy() during normal response cleanup, which
        // would prematurely close the bidirectional H2 stream. The
        // stream lifecycle is managed by our res.end() interceptor.
        if (!this.destroyed) {
            super.destroy(err);
        }
    }
}

// Proxy TLS methods (getPeerCertificate, getCipher, …) to the real socket.
for (const method of TLS_METHODS) {
    Http2SocketProxy.prototype[method] = function (...args) {
        const fn = this._parentSocket[method];
        return typeof fn === 'function' ? fn.apply(this._parentSocket, args) : undefined;
    };
}

// ---- Server factory ----

/**
 * Creates an HTTP/2 secure server that is fully compatible with Express 4.
 *
 * @param {object} options  TLS / server options (key, cert, ca, …).
 * @param {Function} app    Express application (request listener).
 * @returns {http2.Http2SecureServer}
 */
function createServer(options, app) {
    const server = http2.createSecureServer({
        ...options,
        allowHTTP1: true,
    });

    // ---- Prevent Node's built-in compatibility layer ----
    //
    // Node lazily attaches the Http2ServerRequest / Http2ServerResponse
    // compatibility mapping (onServerStream) when the first 'request'
    // listener is registered (via a 'newListener' watcher called
    // setupCompat).  We strip that watcher BEFORE adding our own
    // 'request' listener so the broken compat objects are never created
    // for HTTP/2 connections.
    server.removeAllListeners('newListener');

    // ---- HTTP/1.1 path (via allowHTTP1 fallback) ----
    //
    // The server's internal HTTP/1.1 fallback emits 'request' with
    // standard IncomingMessage / ServerResponse — Express handles these
    // natively.
    server.on('request', (req, res) => {
        req.isSpdy = false;
        app(req, res);
    });

    // ---- HTTP/2 path ----
    //
    // Each HTTP/2 stream is converted into a real http.IncomingMessage +
    // http.ServerResponse pair and dispatched to Express.
    server.on('stream', (stream, headers) => {
        _dispatchHttp2Stream(server, stream, headers, app);
    });

    return server;
}

// ---- Stream → Express dispatch ----

/**
 * Build an Express-compatible (req, res) pair from an HTTP/2 stream and
 * dispatch them into the application.
 */
function _dispatchHttp2Stream(server, stream, headers, app) {
    const session = stream.session;
    if (!session || !session.socket) return;

    // --- Socket ---
    const socket = new Http2SocketProxy(stream, session);
    socket.server = server;

    // --- Request (real http.IncomingMessage) ---
    const req = new http.IncomingMessage(socket);
    req.httpVersion = '2.0';
    req.httpVersionMajor = 2;
    req.httpVersionMinor = 0;
    req.method = headers[':method'] || 'GET';
    req.url = headers[':path'] || '/';
    req.isSpdy = true;
    req.connection = socket;

    // Translate HTTP/2 pseudo-headers → HTTP/1.1 headers.
    const h1Headers = {};
    const rawHeaders = [];
    for (const [key, value] of Object.entries(headers)) {
        if (key === ':authority') {
            h1Headers['host'] = value;
            rawHeaders.push('host', value);
        } else if (!key.startsWith(':')) {
            h1Headers[key] = value;
            rawHeaders.push(key, value);
        }
    }
    req.headers = h1Headers;
    req.rawHeaders = rawHeaders;

    // Pipe stream data into the IncomingMessage so Express body parsers work.
    let reqBodyDone = false;
    stream.on('data', (chunk) => req.push(chunk));
    stream.on('end', () => { reqBodyDone = true; req.push(null); });
    stream.on('error', (err) => { reqBodyDone = true; req.destroy(err); });

    // --- Response (real http.ServerResponse) ---
    const res = new http.ServerResponse(req);
    res.assignSocket(socket);

    // The standard ServerResponse serialises headers as raw HTTP/1.1 text
    // and writes them to the socket.  For HTTP/2 we need to intercept and
    // call stream.respond() instead.

    let h2HeadersSent = false;

    /**
     * Flush Express-set headers through the HTTP/2 stream.
     * Must be called before any body data is written.
     */
    function _sendH2Headers() {
        if (h2HeadersSent || stream.destroyed) return;
        h2HeadersSent = true;

        const h2h = {':status': res.statusCode || 200};
        const names = res.getHeaderNames();
        for (const name of names) {
            h2h[name] = res.getHeader(name);
        }

        try {
            stream.respond(h2h, {endStream: false});
        } catch (_) {
            // stream may have been reset / destroyed
        }
    }

    // Intercept writeHead so we capture the status code + any headers
    // passed directly to writeHead, then flush via stream.respond().
    const _origWriteHead = res.writeHead;
    res.writeHead = function writeHead(statusCode, reason, obj) {
        if (typeof reason === 'string') {
            res.statusMessage = reason;
        } else {
            obj = reason;
        }
        res.statusCode = statusCode;

        if (obj) {
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                if (keys[i]) res.setHeader(keys[i], obj[keys[i]]);
            }
        }

        // Mark headers as sent so ServerResponse doesn't try to
        // serialise them as HTTP/1.1 text to the socket.
        res._header = true;
        res._headerSent = true;

        _sendH2Headers();
        return res;
    };

    // Intercept write to ensure headers go first.
    const _origWrite = res.write;
    res.write = function write(chunk, encoding, cb) {
        if (!h2HeadersSent) _sendH2Headers();
        if (stream.destroyed) return false;
        return stream.write(chunk, encoding, cb);
    };

    // Intercept end.
    const _origEnd = res.end;
    res.end = function end(chunk, encoding, cb) {
        if (!h2HeadersSent) _sendH2Headers();
        if (stream.destroyed) {
            if (typeof cb === 'function') cb();
            return res;
        }

        // Detach the socket before ending so ServerResponse doesn't
        // try to write the HTTP/1.1 terminator to it.
        res.detachSocket(socket);

        function finishStream() {
            if (stream.destroyed) {
                res.emit('finish');
                if (typeof cb === 'function') cb();
                return;
            }
            if (chunk != null) {
                stream.end(chunk, encoding, () => {
                    res.emit('finish');
                    if (typeof cb === 'function') cb();
                });
            } else {
                stream.end(() => {
                    res.emit('finish');
                    if (typeof cb === 'function') cb();
                });
            }
        }

        // If the request body is still streaming in, defer stream.end()
        // until the read side completes. Otherwise undici sees
        // "HTTP/2: stream half-closed (remote)".
        if (reqBodyDone) {
            finishStream();
        } else {
            stream.on('end', finishStream);
        }

        return res;
    };

    // ---- Dispatch ----
    app(req, res);
}

module.exports = {createServer};
