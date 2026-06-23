/**
 * Undici 8.x compatibility shim.
 *
 * cassproject's EcRemote destructures {fetch, FormData} from the `undici`
 * npm package. Undici 8.x's fetch doesn't recognize Node's native FormData
 * — it serializes it as "[object FormData]" with Content-Type: text/plain
 * instead of properly encoding as multipart/form-data.
 *
 * This shim intercepts require('undici') and returns a Proxy that:
 *  - Replaces undici.fetch → globalThis.fetch (native or allow-list wrapper)
 *  - Replaces undici.FormData → globalThis.FormData (native)
 *  - Passes through everything else (setGlobalDispatcher, Agent, etc.)
 *
 * Must be loaded BEFORE cassproject is required, and AFTER any globalThis.fetch
 * wrappers (e.g. the fetch allow-list in server.js) are installed.
 */
'use strict';

const Module = require('module');
const origRequire = Module.prototype.require;

Module.prototype.require = function patchedRequire(id) {
    const result = origRequire.apply(this, arguments);
    if (id === 'undici' && typeof globalThis.fetch === 'function') {
        return new Proxy(result, {
            get(target, prop) {
                if (prop === 'fetch') return globalThis.fetch;
                if (prop === 'FormData') return globalThis.FormData;
                return target[prop];
            }
        });
    }
    return result;
};
