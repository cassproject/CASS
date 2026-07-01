/* -
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
const { skyrepoGetParsed } = require('./get');
const { skyrepoPutParsed } = require('./put');
const { skyrepoDelete } = require('./delete');
const { skyrepoSearch } = require('./search');
const objectNotFoundError = require('./kbac.js').objectNotFoundError;

const endpointData = async function () {
    let q = this.params.q;
    const urlRemainder = this.params.urlRemainder;
    let start = 0;
    if (this.params.start !== undefined) {
        if (this.params.start != null) {
            start = parseInt(this.params.start);
        }
    }
    let size = 50;
    if (this.params.size !== undefined) {
        if (this.params.size != null) {
            size = parseInt(this.params.size);
        }
    }
    if (this.params.refresh !== undefined) {
        if (this.params.refresh != null) {
            this.ctx.put('refresh', this.params.refresh);
        }
    }
    let sort = this.params.sort;
    let track_scores = this.params.track_scores;
    let index_hint = this.params.index_hint;
    let history = this.params.history;
    let ids = this.params.ids;
    let searchParams = (fileFromDatastream).call(this, 'searchParams', null);
    if (searchParams != null) {
        searchParams = fileToString(searchParams);
        if (searchParams !== undefined) {
            if (searchParams != null) {
                searchParams = JSON.parse(searchParams);
            }
        }
        if ((searchParams)['q'] != undefined) {
            if ((searchParams)['q'] != null) {
                q = (searchParams)['q'];
            }
        }
        if ((searchParams)['start'] != undefined) {
            if ((searchParams)['start'] != null) {
                start = (searchParams)['start'];
            }
        }
        if ((searchParams)['size'] != undefined) {
            if ((searchParams)['size'] != null) {
                size = (searchParams)['size'];
            }
        }
        if ((searchParams)['sort'] != undefined) {
            if ((searchParams)['sort'] != null) {
                sort = (searchParams)['sort'];
            }
        }
        if ((searchParams)['track_scores'] != undefined) {
            if ((searchParams)['track_scores'] != null) {
                track_scores = (searchParams)['track_scores'];
            }
        }
        if ((searchParams)['index_hint'] != undefined) {
            if ((searchParams)['index_hint'] != null) {
                index_hint = (searchParams)['index_hint'];
            }
        }
        if ((searchParams)['history'] != undefined) {
            if ((searchParams)['history'] != null) {
                history = (searchParams)['history'];
            }
        }
        if ((searchParams)['ids'] != undefined) {
            if ((searchParams)['ids'] != null) {
                ids = (searchParams)['ids'];
            }
        }
    }
    if (size === undefined || size == null) {
        size = 50;
    }
    if (start === undefined || start == null) {
        start = 0;
    }
    if (q !== undefined && q != null) {
        return JSON.stringify(await (skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores, index_hint, null, ids));
    }
    const methodType = this.params.methodType;
    const parseParams = queryParse.call(this, urlRemainder, null);
    const id = parseParams['id'];
    const type = parseParams['type'];
    const version = parseParams['version'];
    if (methodType == 'DELETE') {
        const oldObj = await (skyrepoDelete).call(this, id, version, type);
        if (oldObj == null) {
            return null;
        }
        global.events.database.afterSave.next(oldObj);
        return null;
    } else if (methodType == 'POST') {
        let o = (fileFromDatastream).call(this, 'data', null);
        if (o !== undefined && o != null) {
            o = JSON.parse(fileToString(o));
        }
        if (o == null || o == '') {
            o = await (skyrepoGetParsed).call(this, id, version, type, null, history);
            if (o == null) {
                error(objectNotFoundError, 404);
            }
            let expand = this.params.expand != null;
            o = (tryFormatOutput).call(this, o, expand, null);
            return o;
        }
        await (skyrepoPutParsed).call(this, o, id, version, type);
        global.events.database.afterSave.next(o);
        return null;
    } else if (methodType == 'GET') {
        let o = await (skyrepoGetParsed).call(this, id, version, type, null, history);
        if (o == null) {
            error(objectNotFoundError, 404);
        }
        let expand = this.params.expand != null;
        o = (tryFormatOutput).call(this, o, expand, null);
        return o;
    }
    return null;
};
/**
 * @openapi
 * /api/data/:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search for data
 *     description: Searches for data in the system using query parameters. Returns a JSON-LD array of matching objects.
 *     x-mcp-tool-name: search_data
 *     x-mcp-description: >
 *       Search the CaSS repository for JSON-LD objects. Returns an array of
 *       matching objects. Use the 'q' parameter with Elasticsearch Simple Query
 *       String syntax to filter results. Common patterns:
 *       - Search by type: q=@type:Competency
 *       - Search by name: q=name:leadership
 *       - Combine: q=name:* AND @type:Framework
 *       All objects in CaSS are JSON-LD and have @context, @id, and @type fields.
 *       Common types include Framework, Competency, CreativeWork, Person, and
 *       Assertion (using dotted namespace like schema.cassproject.org.0.4.Framework).
 *     x-mcp-hints: >
 *       Query syntax (Elasticsearch Simple Query String):
 *       - Wildcard: q=* (all objects)
 *       - By type: q=@type:Competency
 *       - By name: q=name:leadership
 *       - Boolean: q=name:math AND @type:Competency
 *       - Phrase: q=name:"critical thinking"
 *       Pagination: start=0, size=50 (default). Max size=10000.
 *       Use index_hint to speed up typed searches (e.g. *competency).
 *     parameters:
 *       - $ref: '#/components/parameters/q'
 *       - $ref: '#/components/parameters/start'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/index_hint'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 *   post:
 *     x-mcp-ignore: true
 *     tags:
 *       - Search
 *     summary: Search for data (POST)
 *     description: Searches for data in the system using a POST request. Useful when query parameters are too long for a GET request.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SearchParams'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 * /api/data/{uid}:
 *   get:
 *     tags:
 *       - Repository
 *     summary: Retrieve data by UID
 *     description: Retrieves data from the system using a unique identifier (GUID or MD5 of @id). Optionally fetches history.
 *     x-mcp-tool-name: get_object
 *     x-mcp-description: >
 *       Retrieve a single JSON-LD object from the CaSS repository by its unique
 *       identifier. The uid is typically a GUID (e.g. ce-07c25f74-9119-11e8-b852-782bcb5df6ac)
 *       or the MD5 hash of the object's full @id URL. The returned object is a
 *       JSON-LD document with @context, @id, @type, and domain-specific fields.
 *       Access-controlled objects may return 404 if the caller lacks permission.
 *       Set history=true to retrieve all historical versions of the object.
 *     x-mcp-hints: >
 *       UID formats accepted:
 *       - GUID: ce-07c25f74-9119-11e8-b852-782bcb5df6ac
 *       - MD5 hash of @id: 5d1433859a739684cc88338f92cf59ad
 *       The response is a JSON-LD object. Key fields:
 *       - @id: the canonical URL identifier
 *       - @type: the object type (e.g. schema.cassproject.org.0.4.Competency)
 *       - @context: the JSON-LD context URL
 *       - @owner: PEM public key(s) of the owner (controls write access)
 *       If the object is encrypted, fields may be unreadable without the right key.
 *       Use history=true to get an array of all versions sorted by timestamp.
 *     parameters:
 *       - $ref: '#/components/parameters/uid'
 *       - $ref: '#/components/parameters/history'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *               - $ref: '#/components/schemas/JsonLd'
 *               - $ref: '#/components/schemas/JsonLdHistory'
 *       404:
 *         description: "Failure to locate data due to permission or absence of data."
 *   post:
 *     tags:
 *       - Repository
 *     summary: Store data by UID
 *     description: Puts data into the system using a specific unique identifier. Requires an appropriate payload.
 *     x-mcp-tool-name: save_object
 *     x-mcp-description: >
 *       Store or update a JSON-LD object in the CaSS repository at a specific
 *       unique identifier. The request body must contain a valid JSON-LD object
 *       with at minimum three fields (context, id, and type prefixed with @).
 *       The uid in the URL path must correspond to the object's GUID or the MD5
 *       hash of its full id URL. Objects may include an owner field (array of
 *       PEM public keys) to restrict who can modify or delete them. If the
 *       object already exists, this overwrites it (the caller must be an owner
 *       or the object must have no owner). A signatureSheet is required for
 *       write access to owned objects.
 *     x-mcp-hints: >
 *       The body must be sent as multipart/form-data with a 'data' field
 *       containing the JSON-LD object. Three JSON-LD fields are required -
 *       the context (e.g. https://schema.cassproject.org/0.4), the id which is
 *       the canonical URL of the object and must match the uid, and the type
 *       (e.g. schema.cassproject.org.0.4.Competency). All three are prefixed
 *       with the at-sign (@context, @id, @type). Optional security fields
 *       include owner, reader, signature, and signatureSha256 (also @-prefixed).
 *       The signatureSheet field provides write authorization.
 *     parameters:
 *       - $ref: '#/components/parameters/uid'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/JsonLd'
 *               signatureSheet:
 *                 $ref: '#/components/schemas/SignatureSheet'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: "Failure to locate data due to permission or absence of data."
 * /api/data/{type}/{uid}:
 *   get:
 *     x-mcp-ignore: true
 *     tags:
 *       - Repository
 *     summary: Retrieve data by type and UID
 *     description: Retrieves data from the system based on its type and unique identifier. Optionally fetches history.
 *     parameters:
 *       - $ref: '#/components/parameters/uid'
 *       - $ref: '#/components/parameters/type'
 *       - $ref: '#/components/parameters/history'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *               - $ref: '#/components/schemas/JsonLd'
 *               - $ref: '#/components/schemas/JsonLdHistory'
 *       404:
 *         description: "Failure to locate data due to permission or absence of data."
 * /api/data/{type}/{uid}/{version}:
 *   get:
 *     x-mcp-ignore: true
 *     tags:
 *       - Repository
 *     summary: Retrieve specific version of data by type and UID
 *     description: Retrieves a specific version of data from the system based on its type and unique identifier. Optionally fetches history.
 *     parameters:
 *       - $ref: '#/components/parameters/type'
 *       - $ref: '#/components/parameters/uid'
 *       - $ref: '#/components/parameters/version'
 *       - $ref: '#/components/parameters/history'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *               - $ref: '#/components/schemas/JsonLd'
 *               - $ref: '#/components/schemas/JsonLdHistory'
 *       404:
 *         description: "Failure to locate data due to permission or absence of data."
 */
bindWebService('/data/*', endpointData);
bindWebService('/data/', endpointData);