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
 *       Use this tool to find objects in the CaSS repository when you need
 *       to discover frameworks, competencies, people, or any other data by
 *       keyword, type, or attribute. Returns an array of matching JSON-LD
 *       objects. This is the primary discovery tool — start here when you
 *       do not already have a specific object's URL or UID.
 *       BOUNDARIES — Do NOT use this tool to fetch a single object whose
 *       URL or UID you already know — use get_object instead. Do NOT use
 *       this tool to record learner evidence — use record_evidence. Do NOT
 *       use this tool to save or update objects — use save_object.
 *       All CaSS objects are JSON-LD with @context, @id, and @type fields.
 *       Common types: Framework, Competency, CreativeWork, Person,
 *       Assertion (dotted form: schema.cassproject.org.0.4.Framework).
 *     x-mcp-hints: >
 *       QUERY SYNTAX (Elasticsearch Simple Query String) —
 *       All objects: q=*
 *       By type: q=@type:Competency
 *       By name: q=name:leadership
 *       Combined: q=name:math AND @type:Competency
 *       Phrase: q=name:"critical thinking"
 *       PAGINATION — start=0 (default), size=50 (default, max 10000).
 *       PERFORMANCE — Set index_hint to narrow the search index
 *       (e.g. index_hint=*competency speeds up competency searches).
 *       For most discovery tasks, the defaults are sufficient.
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
 *       Use this tool to retrieve a single, specific object from CaSS when
 *       you already have its unique identifier (UID). This is the fastest
 *       way to fetch one known object by its ID.
 *       BOUNDARIES — Do NOT use this tool to search or browse for objects.
 *       Use search_data for discovery. Do NOT use this tool to save or
 *       update data — use save_object instead.
 *       Returns a JSON-LD document with @context, @id, @type, and
 *       domain-specific fields. Access-controlled objects return 404 if
 *       the caller lacks read permission.
 *     x-mcp-hints: >
 *       UID FORMATS — The uid parameter accepts two formats:
 *       GUID: ce-07c25f74-9119-11e8-b852-782bcb5df6ac
 *       MD5 hash of @id: 5d1433859a739684cc88338f92cf59ad
 *       You can extract the UID from an object's @id URL — it is the
 *       last path segment.
 *       KEY RESPONSE FIELDS —
 *       "@id" is the canonical URL identifier,
 *       "@type" is the object type (e.g. schema.cassproject.org.0.4.Competency),
 *       "@context" is the JSON-LD context URL,
 *       "@owner" contains PEM public key(s) controlling write access.
 *       HISTORY — Set history=true to retrieve all versions of the
 *       object as an array sorted by timestamp.
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
 *       Use this tool to create a new object or update an existing one in
 *       the CaSS repository. Every object in CaSS is a JSON-LD document
 *       with three required fields: @context, @id, and @type.
 *       BOUNDARIES — Do NOT use this tool to record learner evidence or
 *       create assertions — use record_evidence instead, which handles
 *       the full xAPI-to-assertion pipeline automatically. Do NOT use
 *       this tool for bulk writes — use the multiPut endpoint.
 *       If the object already exists, this overwrites it. The caller
 *       must be listed as an @owner, or the object must have no owner.
 *     x-mcp-hints: >
 *       SENDING DATA — The body must be sent as multipart/form-data with
 *       a field named 'data' containing the JSON-LD object.
 *       THREE REQUIRED FIELDS —
 *       "@context" (e.g. "https://schema.cassproject.org/0.4"),
 *       "@id" (the canonical URL, the UID in the URL path must match),
 *       "@type" (e.g. "schema.cassproject.org.0.4.Competency").
 *       OWNERSHIP — Include "@owner" (array of PEM public keys) to
 *       restrict who can modify or delete the object.
 *       AUTHORIZATION — Include a signatureSheet field to prove write
 *       access when updating owned objects.
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