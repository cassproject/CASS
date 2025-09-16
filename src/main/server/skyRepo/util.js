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
const fs = require('fs');

global.keyFor = function (filename) {
    // Check environment variable first
    if (process.env[filename]) return process.env[filename];

    // Build possible file paths
    const fileNames = [
        filename + '.pem',
        'etc/' + filename + '.pem'
    ];

    // Try to find an existing key file
    for (const filePath of fileNames) {
        if (fs.existsSync(filePath)) {
            return fileToString(fileLoad(filePath, false, true));
        }
    }

    // If not found, generate and save a new key
    const keyPath = 'etc/' + filename + '.pem';
    fileSave(EcPpk.generateKey().toPem(), keyPath);
    return fileToString(fileLoad(keyPath, false, true));
};

global.elasticHeaders = function () {
    const headers = {};
    if (process.env.ELASTICSEARCH_AUTHORIZATION != null) {
        headers.Authorization = process.env.ELASTICSEARCH_AUTHORIZATION.trim();
    }
    return headers;
};

global.elasticSearchVersion = function () {
    return ((elasticSearchInfo)['version'])['number'];
};

global.getTypeFromObject = function (o) {
    let encryptedType = (o)['encryptedType'];
    let encryptedContext = (o)['encryptedContext'];
    let type = (o)['@type'];
    let context = (o)['@context'];
    if (type == null) {
        type = (o)['type'];
    }
    if (context == null) {
        context = (o)['context'];
    }
    if (encryptedType == null) {
        encryptedType = (o)['@encryptedType'];
    }
    if (encryptedContext == null) {
        encryptedContext = (o)['@encryptedContext'];
    }
    if (encryptedType != null) {
        type = encryptedType;
    }
    if (encryptedContext != null) {
        context = encryptedContext;
    }
    if (type == null) {
        return null;
    }
    if (type.indexOf('http') != -1) {
        return type;
    }
    if (context == null) {
        return type;
    }
    if (context.endsWith('/')) {
        return context + type;
    } else {
        return context + '/' + type;
    }
};

global.inferTypeFromObj = function (o, atType) {
    let fullType = getTypeFromObject(o);
    if (fullType == null) {
        return fullType;
    }
    fullType = fullType.replace('http://', '');
    fullType = fullType.replace('https://', '');
    fullType = fullType.replace(/\//g, '.');
    fullType = fullType.replace(/:/g, '.');
    return fullType;
};

global.inferTypeWithoutObj = function (atType) {
    if (atType !== undefined && atType != null) {
        return atType;
    }
    return '_all';
};

const languages = require('./langs').reduce(function (result, item, index, array) {
    result[item] = 1;
    return result;
}, {});

global.flattenLangstrings = function (o) {
    if (EcObject.isObject(o)) {
        let langStringObject = {};
        let langStringArray = [];
        for (const key of EcObject.keys(o)) {
            if (key == '@value') {
                return o[key];
            }
            if (langStringArray != null) {
                if ((languages)[key.toLowerCase()] == 1) {
                    langStringArray.push(flattenLangstrings(o[key]));
                } else {
                    langStringArray = null;
                }
            }
            langStringObject[key] = flattenLangstrings(o[key]);
        }
        if (langStringArray != null && langStringArray.length > 0) {
            return langStringArray;
        }
        return langStringObject;
    } else if (EcArray.isArray(o)) {
        return o.map((x) => flattenLangstrings(x));
    }
    return o;
};

global.getTypeForObject = function (o, type) {
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.') || elasticSearchVersion().startsWith('9.')) {
        return '_doc';
    } else {
        return inferTypeFromObj(o, type);
    }
};

global.queryParse = function (urlRemainder) {
    if (urlRemainder == null && this.params.urlRemainder != null) {
        urlRemainder = this.params.urlRemainder;
    }
    if (urlRemainder == null) {
        error('No resource specified.', 404);
    }
    const split = urlRemainder.split('/');
    const result = {};
    if (split.length >= 1) {
        (result)['id'] = split[0];
    }
    if (split.length >= 2) {
        (result)['type'] = split[0] == '' ? null : split[0];
        (result)['id'] = split[1];
    }
    if (split.length == 3) {
        (result)['version'] = split[2] == '' ? null : parseInt(split[2]);
    }
    return result;
};

global.tryFormatOutput = function (o, expand) {
    const hdrs = (headers).call(this);
    let accept = (hdrs)['Accept'];
    if (accept == null) {
        accept = (hdrs)['accept'];
    }
    if (accept == null) {
        if (expand == true) {
            return JSON.stringify(jsonLdExpand(o));
        } else {
            return JSON.stringify(o);
        }
    }
    if (accept == 'text/n4' || accept == 'application/rdf+n4') {
        return jsonLdToNQuads(o);
    }
    if (accept == 'application/rdf+xml') {
        return jsonLdToRdfXml(o);
    }
    if (accept == 'application/x-turtle' || accept == 'text/turtle') {
        return jsonLdToTurtle(o);
    }
    return JSON.stringify(o);
};
