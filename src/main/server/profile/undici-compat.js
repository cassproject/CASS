/**
 * Undici 8.x compatibility shim.
 *
 * cassproject's EcRemote destructures {fetch} from the `undici` npm package,
 * while EcRepository builds request bodies with the *global* FormData (it only
 * swaps in undici's FormData on Node 16). Undici 8.x's fetch does not
 * recognize Node's native FormData: instead of encoding multipart/form-data it
 * stringifies the body and sends Content-Type: text/plain;charset=UTF-8, which
 * the server then rejects with "Unsupported content type" from busboy.
 *
 * This shim intercepts require('undici') and returns a Proxy that:
 *  - Replaces undici.fetch → globalThis.fetch (native or allow-list wrapper)
 *  - Replaces undici.FormData → globalThis.FormData (native)
 *  - Passes through everything else (setGlobalDispatcher, Agent, etc.)
 *
 * so that both halves of the pair come from the same implementation.
 *
 * If undici is not installed at all, require('undici') is satisfied with a
 * minimal native-backed stand-in rather than throwing, so callers that treat
 * undici as optional keep working. If the runtime has no global fetch either
 * (Node < 18), the shim stays out of the way entirely and the original
 * behaviour — including the original error — is preserved.
 *
 * Must be loaded BEFORE cassproject is required, and AFTER any globalThis.fetch
 * wrappers (e.g. the fetch allow-list in server.js) are installed. Loading it
 * more than once is harmless.
 */
'use strict';

const Module = require('module');

// Guard against double-patching if this shim is required from several entry
// points (server.js, the profile worker, tests, scripts).
if (!Module.prototype.require.__undiciCompatPatched) {
    const origRequire = Module.prototype.require;

    const patchedRequire = function patchedRequire(id) {
        if (id !== 'undici') {
            return origRequire.apply(this, arguments);
        }

        let real = null;
        let loadError = null;
        try {
            real = origRequire.apply(this, arguments);
        } catch (e) {
            loadError = e;
        }

        // No global fetch to substitute (Node < 18): leave everything as-is.
        if (typeof globalThis.fetch !== 'function') {
            if (loadError) throw loadError;
            return real;
        }

        if (real) {
            return new Proxy(real, {
                get(target, prop) {
                    if (prop === 'fetch') return globalThis.fetch;
                    if (prop === 'FormData') return globalThis.FormData;
                    return target[prop];
                }
            });
        }

        // undici is not installed — hand back a native-backed stand-in so
        // optional consumers (cassproject) can still initialize.
        return {
            fetch: globalThis.fetch,
            FormData: globalThis.FormData,
            Headers: globalThis.Headers,
            Request: globalThis.Request,
            Response: globalThis.Response,
            setGlobalDispatcher: function () { /* no dispatcher to configure */ },
            getGlobalDispatcher: function () { return null; },
            Agent: function Agent() { /* inert stand-in */ },
        };
    };

    patchedRequire.__undiciCompatPatched = true;
    Module.prototype.require = patchedRequire;
}
