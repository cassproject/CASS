/* -
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2025 Eduworks Corporation and other contributing parties.
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
 *     description: Searches for data in the system.
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
 *     tags:
 *       - Search
 *     description: Searches for data in the system.
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
 *     description: Retrieves data from the system.
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
 *     description: Puts data into the system.
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
 *     tags:
 *       - Repository
 *     description: Searches for data in the system.
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
 *     tags:
 *       - Repository
 *     description: Searches for data in the system.
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