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

const EcArray = require('cassproject/src/com/eduworks/ec/array/EcArray');
const EcRsaOaepAsync = require('cassproject/src/com/eduworks/ec/crypto/EcRsaOaepAsync');
const EcEncryptedValue = require('cassproject/src/org/cassproject/ebac/repository/EcEncryptedValue');
const EcRemoteLinkedData = require('cassproject/src/org/cassproject/schema/general/EcRemoteLinkedData');
const fs = require('fs');
const sharedAdminCache = require("./shims/util/sharedAdminCache");

global.keyFor = function (filename) {
    if (process.env[filename] != null) {
        return process.env[filename];
    }
    if (fs.existsSync(filename + '.pem')) {
        return fileToString(fileLoad(filename + '.pem', false, true));
    }
    if (fs.existsSync('etc/' + filename + '.pem')) {
        return fileToString(fileLoad('etc/' + filename + '.pem', false, true));
    }
    if (!fs.existsSync('etc')) {
        createDirectory('etc');
    }
    fileSave(EcPpk.generateKey().toPem(), 'etc/' + filename + '.pem');
    return fileToString(fileLoad('etc/' + filename + '.pem', false, true));
};

global.repoAutoDetect = function () {
    if (process.env.CASS_LOOPBACK != null) {
        repo.init(process.env.CASS_LOOPBACK, function () {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassRepoInit', EcObject.keys(EcRemoteLinkedData.forwardingTable).length + ' records now in forwarding table.');
        }, (error) => {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'CassRepoInitError', error);
        });
    } else {
        repo.autoDetectRepository();
    }

    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassRepoAutoDetect',
        'Loopback: ' + repo.selectedServer,
        'Loopback Proxy: ' + repo.selectedServerProxy,
        'Elasticsearch Endpoint: ' + elasticEndpoint,
        'Text Encoding: ' + java.lang.System.getProperty('file.encoding'),
        'Text Encoding: ' + java.nio.charset.Charset.defaultCharset().toString());
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

const getTypeFromObject = function (o) {
    let encryptedType = o.encryptedType || o['@encryptedType'];
    let encryptedContext = o.encryptedContext || o['@encryptedContext'];
    let type = encryptedType || o['@type'] || o.type;
    let context = encryptedContext || o['@context'] || o.context;
    if (type == null)
        return null;
    if (type.indexOf('http') != -1)
        return type;
    if (context == null)
        return type;
    if (context.endsWith('/')) {
        return context + type;
    } else {
        return context + '/' + type;
    }
};

const signatureSheet = async function () {
    let sigSheet = this.ctx.get('signatureSheet');
    if (sigSheet != null) {
        return sigSheet;
    }
    sigSheet = [];

    const fromDatastream = (fileFromDatastream).call(this, 'signatureSheet', null);
    const stringFromDatastream = fileToString(fromDatastream);
    if (stringFromDatastream != null) {
        try {
            sigSheet = sigSheet.concat(JSON.parse(stringFromDatastream));
        } catch {
            error('Missing or Malformed Signature.', 496);
        }
    }

    const hdrs = headers.call(this);
    if (hdrs.signatureSheet != null || hdrs.signaturesheet != null) {
        sigSheet = sigSheet.concat(JSON.parse(hdrs.signatureSheet || hdrs.signaturesheet));
    }
    
    for (let i = 0; i < sigSheet.length; i++) {
        const signature = new EbacSignature();
        signature.copyFrom(sigSheet[i]);
        if (signature == null) error('Missing Signature.', 496);
        
        let owner = signature.owner || signature["@owner"];
        signature['@owner'] = owner;
        delete signature.owner;
        
        const ownerPk = EcPk.fromPem(owner);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassIdentity', ownerPk.fingerprint());

        const validTypes = signature.getTypes();
        // Check if the signature type is valid
        if (!validTypes.some(validType => validType == getTypeFromObject(sigSheet[i]))) {
            error('Invalid Signature Version.', 422);
        }
        if (signature.expiry == null) {
            error('Missing expiry date.', 422);
        }
        const now = new Date().getTime();
        if (signature.expiry < now) {
            // Used to replay replication / database log files without "just jamming the data in"
            if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || this.ctx.sanctionedReplay != true) {
                error('A Signature is Expired. My time is ' + now + ' and the signature expires at ' + signature.expiry, 419);
            }
        }
        let signBytes = signature.signature || signature['@signature'];
        let signBytesSha256 = signature.signatureSha256 || signature['@signatureSha256'];
        let realSignature = signature.toJson();
        signature.signature = (signature)['@signature'] = signature.signatureSha256 = (signature)['@signatureSha256'] = null;
        if (process.env.REJECT_SHA1) {
            if (signBytes != null && signBytesSha256 == null) {
                warn('SHA1 Signature Detected. Rejecting: ' + realSignature);
                error('SHA1 Signature is not supported. Invalid Signature Detected: ' + realSignature, 451);
            } else if (!(await EcRsaOaepAsync.verifySha256(ownerPk, signature.toJson(), signBytesSha256))) {
                error('Invalid Signature Detected: ' + realSignature, 451);
            }
        } else {
            if (signBytes == null && signBytesSha256 == null) {
                error('No Signature Detected: ' + realSignature, 451);
            }
            if (signBytesSha256 != null) {
                if (!(await EcRsaOaepAsync.verifySha256(ownerPk, signature.toJson(), signBytesSha256))) {
                    error('Invalid Signature Detected: ' + realSignature, 451);
                }
            }
            if (signBytes != null) {
                if (!(await EcRsaOaepAsync.verify(ownerPk, signature.toJson(), signBytes))) {
                    error('Invalid Signature Detected: ' + realSignature, 451);
                }
            }
        }
        signature.owner = signature['@owner'];
        sigSheet[i] = signature;
    }
    this.ctx.put('signatureSheet', sigSheet);
    return sigSheet;
};
const isEncryptedType = function (obj) {
    return obj.isAny(new EbacEncryptedValue().getTypes());
};
const filterResults = async function (o, dontDecryptInSso) {
    if (o == null) {
        return o;
    }
    if (EcArray.isArray(o)) {
        let me = this;
        return (await Promise.all(o.map(async (x) => {
            try {
                return await filterResults.call(me, x, dontDecryptInSso);
            } catch (ex) {
                if (ex != null && ex.toString().indexOf('Object not found or you did not supply sufficient permissions to access the object.') == -1) {
                    throw ex;
                }
                return null;
            }
        }))).filter((x) => x);
    } else if (EcObject.isObject(o)) {
        delete o.decryptedSecret;
        const rld = new EcRemoteLinkedData((o)['@context'], (o)['@type']);
        rld.copyFrom(o);
        if ((rld.reader != null && rld.reader.length != 0) || isEncryptedType(rld)) {
            const signatures = await (signatureSheet).call(this);
            let foundSignature = false;
            for (let signature of signatures) {
                if (JSON.stringify(o).indexOf(signature.owner) != -1) {
                    foundSignature = true;
                    break;
                }
                if (EcPk.fromPem(skyrepoAdminPk()).equals(EcPk.fromPem(signature.owner))) {
                    foundSignature = true;
                    break;
                }
            }
            if (!foundSignature) {
                throw new Error('Object not found or you did not supply sufficient permissions to access the object.');
            }
            // Securing Proxy: Decrypt data that is being passed back via SSO.
            if (this.ctx.req.eim != null && dontDecryptInSso == null) {
                try {
                    if (isEncryptedType(rld)) {
                        const eev = new EcEncryptedValue();
                        eev.copyFrom(o);
                        o.decryptedSecret = await eev.decryptSecret(this.ctx.req.eim);
                    }
                } catch (msg) {
                    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'CassDecryptError', 'We couldn\'t decrypt it, hope the client has better luck! -- ' + msg);
                }
            }
        }
        const keys = EcObject.keys(o);
        for (let key of keys) {
            let result = null;
            try {
                result = await (filterResults).call(this, (o)[key], dontDecryptInSso);
            } catch (ex) {
                if (ex != null && ex.toString().indexOf('Object not found or you did not supply sufficient permissions to access the object.') == -1) {
                    throw ex;
                }
                result = null;
            }
            if (result != null) {
                (o)[key] = result;
            } else {
                delete (o)[key];
            }
        }
        return o;
    } else {
        return o;
    }
};
const skyrepoUrlType = function (o) {
    return getTypeFromObject(o);
};
const inferTypeFromObj = function (o, atType) {
    // if (atType != null)
    //     return atType;
    let fullType = skyrepoUrlType(o);
    if (fullType == null) {
        return fullType;
    }
    fullType = fullType.replace('http://', '');
    fullType = fullType.replace('https://', '');
    fullType = fullType.replace('/', '.');
    fullType = fullType.replace('/', '.');
    fullType = fullType.replace('/', '.');
    fullType = fullType.replace(':', '.');
    fullType = fullType.replace(':', '.');
    fullType = fullType.replace(':', '.');
    return fullType;
};
const inferTypeWithoutObj = function (atType) {
    if (atType !== undefined && atType != null) {
        return atType;
    }
    return '_all';
};
const putUrl = function (o, id, version, type) {
    const typeFromObj = inferTypeFromObj(o, type);
    let versionPart = null;
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    if (version === undefined || version == null) {
        versionPart = '?' + refreshPart;
    } else {
        versionPart = '?version=' + (version === undefined || version == null ? '' : version) + '&version_type=external&' + refreshPart;
    }
    let url = elasticEndpoint;
    url += '/' + typeFromObj.toLowerCase();
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/' + typeFromObj;
    }
    url += '/' + encodeURIComponent(id) + versionPart;
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoPutUrl', 'Put:' + url);
    }
    return url;
};
const putPermanentUrl = function (o, id, version, type) {
    let versionPart = null;
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    if (version === undefined || version == null) {
        versionPart = '?' + refreshPart;
    } else {
        versionPart = '?version=' + (version === undefined || version == null ? '' : version) + '&version_type=external&' + refreshPart;
    }
    let url = elasticEndpoint;
    url += '/permanent';
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/permanent';
    }
    url += '/' + encodeURIComponent(id) + '.' + (version === undefined || version == null ? '' : version) + versionPart;
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoPutPermanentUrl', 'PutPermanent:' + url);
    }
    return url;
};
const putPermanentBaseUrl = function (o, id, version, type) {
    let versionPart = null;
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    if (version === undefined || version == null) {
        versionPart = '?' + refreshPart;
    } else {
        versionPart = '?version=' + (version === undefined || version == null ? '' : version) + '&version_type=external&' + refreshPart;
    }
    let url = elasticEndpoint;
    url += '/permanent';
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/permanent';
    }
    url += '/' + encodeURIComponent(id) + '.' + versionPart;
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoPutPermanentBaseUrl', 'PutPermanentBase:' + url);
    }
    return url;
};
const getUrl = function (index, id, version, type) {
    let url = elasticEndpoint;
    url += '/' + index;
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else if (index == 'permanent') {
        url += '/permanent';
    } else {
        const typeFromObj = inferTypeWithoutObj(type);
        url += '/' + typeFromObj;
    }
    if (index == 'permanent') {
        url += '/' + encodeURIComponent(id) + '.' + (version === undefined || version == null ? '' : version);
    } else {
        url += '/' + encodeURIComponent(id);
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoGetUrl', 'Get:' + url);
    }
    return url;
};
const deleteUrl = function (id, version, type) {
    const typeFromObj = inferTypeWithoutObj(type);
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    let url = elasticEndpoint;
    url += '/' + typeFromObj.toLowerCase();
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/' + typeFromObj;
    }
    url += '/' + encodeURIComponent(id);
    url += '?' + refreshPart;
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoDeleteUrl', 'Delete:' + url);
    }
    return url;
};
const deletePermanentBaseUrl = function (id, version, type) {
    let url = elasticEndpoint;
    url += '/permanent';
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/permanent';
    }
    url += '/' + encodeURIComponent(id) + '.';
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoDeletePermBase', 'DeletePermanentBase:' + url);
    }
    return url;
};
let languages = null;
const flattenLangstrings = function (o) {
    if (languages == null) {
        languages = {};
        const ary = [
            'en-us',
            'en-gb',
            'aa',
            'ab',
            'ae',
            'af',
            'ak',
            'am',
            'an',
            'ar',
            'as',
            'av',
            'ay',
            'az',
            'ba',
            'be',
            'bg',
            'bh',
            'bi',
            'bm',
            'bn',
            'bo',
            'br',
            'bs',
            'ca',
            'ce',
            'ch',
            'co',
            'cr',
            'cs',
            'cu',
            'cv',
            'cy',
            'da',
            'de',
            'dv',
            'dz',
            'ee',
            'el',
            'en',
            'eo',
            'es',
            'et',
            'eu',
            'fa',
            'ff',
            'fi',
            'fj',
            'fo',
            'fr',
            'fy',
            'ga',
            'gd',
            'gl',
            'gn',
            'gu',
            'gv',
            'ha',
            'he',
            'hi',
            'ho',
            'hr',
            'ht',
            'hu',
            'hy',
            'hz',
            'ia',
            'id',
            'ie',
            'ig',
            'ii',
            'ik',
            'io',
            'is',
            'it',
            'iu',
            'ja',
            'jv',
            'ka',
            'kg',
            'ki',
            'kj',
            'kk',
            'kl',
            'km',
            'kn',
            'ko',
            'kr',
            'ks',
            'ku',
            'kv',
            'kw',
            'ky',
            'la',
            'lb',
            'lg',
            'li',
            'ln',
            'lo',
            'lt',
            'lu',
            'lv',
            'mg',
            'mh',
            'mi',
            'mk',
            'ml',
            'mn',
            'mr',
            'ms',
            'mt',
            'my',
            'na',
            'nb',
            'nd',
            'ne',
            'ng',
            'nl',
            'nn',
            'no',
            'nr',
            'nv',
            'ny',
            'oc',
            'oj',
            'om',
            'or',
            'os',
            'pa',
            'pi',
            'pl',
            'ps',
            'pt',
            'qu',
            'rm',
            'rn',
            'ro',
            'ru',
            'rw',
            'sa',
            'sc',
            'sd',
            'se',
            'sg',
            'sh',
            'si',
            'sk',
            'sl',
            'sm',
            'sn',
            'so',
            'sq',
            'sr',
            'ss',
            'st',
            'su',
            'sv',
            'sw',
            'ta',
            'te',
            'tg',
            'th',
            'ti',
            'tk',
            'tl',
            'tn',
            'to',
            'tr',
            'ts',
            'tt',
            'tw',
            'ty',
            'ug',
            'uk',
            'ur',
            'uz',
            've',
            'vi',
            'vo',
            'wa',
            'wo',
            'xh',
            'yi',
            'yo',
            'za',
            'zh',
            'zu',
            'aaa',
            'aab',
            'aac',
            'aad',
            'aae',
            'aaf',
            'aag',
            'aah',
            'aai',
            'aak',
            'aal',
            'aan',
            'aao',
            'aap',
            'aaq',
            'aas',
            'aat',
            'aau',
            'aav',
            'aaw',
            'aax',
            'aaz',
            'aba',
            'abb',
            'abc',
            'abd',
            'abe',
            'abf',
            'abg',
            'abh',
            'abi',
            'abj',
            'abl',
            'abm',
            'abn',
            'abo',
            'abp',
            'abq',
            'abr',
            'abs',
            'abt',
            'abu',
            'abv',
            'abw',
            'abx',
            'aby',
            'abz',
            'aca',
            'acb',
            'acd',
            'ace',
            'acf',
            'ach',
            'aci',
            'ack',
            'acl',
            'acm',
            'acn',
            'acp',
            'acq',
            'acr',
            'acs',
            'act',
            'acu',
            'acv',
            'acw',
            'acx',
            'acy',
            'acz',
            'ada',
            'adb',
            'add',
            'ade',
            'adf',
            'adg',
            'adh',
            'adi',
            'adj',
            'adl',
            'adn',
            'ado',
            'adq',
            'adr',
            'ads',
            'adt',
            'adu',
            'adw',
            'adx',
            'ady',
            'adz',
            'aea',
            'aeb',
            'aec',
            'aed',
            'aee',
            'aek',
            'ael',
            'aem',
            'aen',
            'aeq',
            'aer',
            'aes',
            'aeu',
            'aew',
            'aey',
            'aez',
            'afa',
            'afb',
            'afd',
            'afe',
            'afg',
            'afh',
            'afi',
            'afk',
            'afn',
            'afo',
            'afp',
            'afs',
            'aft',
            'afu',
            'afz',
            'aga',
            'agb',
            'agc',
            'agd',
            'age',
            'agf',
            'agg',
            'agh',
            'agi',
            'agj',
            'agk',
            'agl',
            'agm',
            'agn',
            'ago',
            'agq',
            'agr',
            'ags',
            'agt',
            'agu',
            'agv',
            'agw',
            'agx',
            'agy',
            'agz',
            'aha',
            'ahb',
            'ahg',
            'ahh',
            'ahi',
            'ahk',
            'ahl',
            'ahm',
            'ahn',
            'aho',
            'ahp',
            'ahr',
            'ahs',
            'aht',
            'aia',
            'aib',
            'aic',
            'aid',
            'aie',
            'aif',
            'aig',
            'aih',
            'aii',
            'aij',
            'aik',
            'ail',
            'aim',
            'ain',
            'aio',
            'aip',
            'aiq',
            'air',
            'ais',
            'ait',
            'aiw',
            'aix',
            'aiy',
            'aja',
            'ajg',
            'aji',
            'ajn',
            'ajp',
            'ajt',
            'aju',
            'ajw',
            'ajz',
            'akb',
            'akc',
            'akd',
            'ake',
            'akf',
            'akg',
            'akh',
            'aki',
            'akj',
            'akk',
            'akl',
            'akm',
            'ako',
            'akp',
            'akq',
            'akr',
            'aks',
            'akt',
            'aku',
            'akv',
            'akw',
            'akx',
            'aky',
            'akz',
            'ala',
            'alc',
            'ald',
            'ale',
            'alf',
            'alg',
            'alh',
            'ali',
            'alj',
            'alk',
            'all',
            'alm',
            'aln',
            'alo',
            'alp',
            'alq',
            'alr',
            'als',
            'alt',
            'alu',
            'alv',
            'alw',
            'alx',
            'aly',
            'alz',
            'ama',
            'amb',
            'amc',
            'ame',
            'amf',
            'amg',
            'ami',
            'amj',
            'amk',
            'aml',
            'amm',
            'amn',
            'amo',
            'amp',
            'amq',
            'amr',
            'ams',
            'amt',
            'amu',
            'amv',
            'amw',
            'amx',
            'amy',
            'amz',
            'ana',
            'anb',
            'anc',
            'and',
            'ane',
            'anf',
            'ang',
            'anh',
            'ani',
            'anj',
            'ank',
            'anl',
            'anm',
            'ann',
            'ano',
            'anp',
            'anq',
            'anr',
            'ans',
            'ant',
            'anu',
            'anv',
            'anw',
            'anx',
            'any',
            'anz',
            'aoa',
            'aob',
            'aoc',
            'aod',
            'aoe',
            'aof',
            'aog',
            'aoh',
            'aoi',
            'aoj',
            'aok',
            'aol',
            'aom',
            'aon',
            'aor',
            'aos',
            'aot',
            'aou',
            'aox',
            'aoz',
            'apa',
            'apb',
            'apc',
            'apd',
            'ape',
            'apf',
            'apg',
            'aph',
            'api',
            'apj',
            'apk',
            'apl',
            'apm',
            'apn',
            'apo',
            'app',
            'apq',
            'apr',
            'aps',
            'apt',
            'apu',
            'apv',
            'apw',
            'apx',
            'apy',
            'apz',
            'aqa',
            'aqc',
            'aqd',
            'aqg',
            'aql',
            'aqm',
            'aqn',
            'aqp',
            'aqr',
            'aqt',
            'aqz',
            'arb',
            'arc',
            'ard',
            'are',
            'arh',
            'ari',
            'arj',
            'ark',
            'arl',
            'arn',
            'aro',
            'arp',
            'arq',
            'arr',
            'ars',
            'art',
            'aru',
            'arv',
            'arw',
            'arx',
            'ary',
            'arz',
            'asa',
            'asb',
            'asc',
            'asd',
            'ase',
            'asf',
            'asg',
            'ash',
            'asi',
            'asj',
            'ask',
            'asl',
            'asn',
            'aso',
            'asp',
            'asq',
            'asr',
            'ass',
            'ast',
            'asu',
            'asv',
            'asw',
            'asx',
            'asy',
            'asz',
            'ata',
            'atb',
            'atc',
            'atd',
            'ate',
            'atg',
            'ath',
            'ati',
            'atj',
            'atk',
            'atl',
            'atm',
            'atn',
            'ato',
            'atp',
            'atq',
            'atr',
            'ats',
            'att',
            'atu',
            'atv',
            'atw',
            'atx',
            'aty',
            'atz',
            'aua',
            'aub',
            'auc',
            'aud',
            'auf',
            'aug',
            'auh',
            'aui',
            'auj',
            'auk',
            'aul',
            'aum',
            'aun',
            'auo',
            'aup',
            'auq',
            'aur',
            'aus',
            'aut',
            'auu',
            'auw',
            'aux',
            'auy',
            'auz',
            'avb',
            'avd',
            'avi',
            'avk',
            'avl',
            'avm',
            'avn',
            'avo',
            'avs',
            'avt',
            'avu',
            'avv',
            'awa',
            'awb',
            'awc',
            'awd',
            'awe',
            'awg',
            'awh',
            'awi',
            'awk',
            'awm',
            'awn',
            'awo',
            'awr',
            'aws',
            'awt',
            'awu',
            'awv',
            'aww',
            'awx',
            'awy',
            'axb',
            'axe',
            'axg',
            'axk',
            'axl',
            'axm',
            'axx',
            'aya',
            'ayb',
            'ayc',
            'ayd',
            'aye',
            'ayg',
            'ayh',
            'ayi',
            'ayk',
            'ayl',
            'ayn',
            'ayo',
            'ayp',
            'ayq',
            'ayr',
            'ays',
            'ayt',
            'ayu',
            'ayy',
            'ayz',
            'aza',
            'azb',
            'azc',
            'azd',
            'azg',
            'azj',
            'azm',
            'azn',
            'azo',
            'azt',
            'azz',
            'baa',
            'bab',
            'bac',
            'bad',
            'bae',
            'baf',
            'bag',
            'bah',
            'bai',
            'baj',
            'bal',
            'ban',
            'bao',
            'bap',
            'bar',
            'bas',
            'bat',
            'bau',
            'bav',
            'baw',
            'bax',
            'bay',
            'bba',
            'bbb',
            'bbc',
            'bbd',
            'bbe',
            'bbf',
            'bbg',
            'bbh',
            'bbi',
            'bbj',
            'bbk',
            'bbl',
            'bbm',
            'bbn',
            'bbo',
            'bbp',
            'bbq',
            'bbr',
            'bbs',
            'bbt',
            'bbu',
            'bbv',
            'bbw',
            'bbx',
            'bby',
            'bbz',
            'bca',
            'bcb',
            'bcc',
            'bcd',
            'bce',
            'bcf',
            'bcg',
            'bch',
            'bci',
            'bcj',
            'bck',
            'bcl',
            'bcm',
            'bcn',
            'bco',
            'bcp',
            'bcq',
            'bcr',
            'bcs',
            'bct',
            'bcu',
            'bcv',
            'bcw',
            'bcy',
            'bcz',
            'bda',
            'bdb',
            'bdc',
            'bdd',
            'bde',
            'bdf',
            'bdg',
            'bdh',
            'bdi',
            'bdj',
            'bdk',
            'bdl',
            'bdm',
            'bdn',
            'bdo',
            'bdp',
            'bdq',
            'bdr',
            'bds',
            'bdt',
            'bdu',
            'bdv',
            'bdw',
            'bdx',
            'bdy',
            'bdz',
            'bea',
            'beb',
            'bec',
            'bed',
            'bee',
            'bef',
            'beg',
            'beh',
            'bei',
            'bej',
            'bek',
            'bem',
            'beo',
            'bep',
            'beq',
            'ber',
            'bes',
            'bet',
            'beu',
            'bev',
            'bew',
            'bex',
            'bey',
            'bez',
            'bfa',
            'bfb',
            'bfc',
            'bfd',
            'bfe',
            'bff',
            'bfg',
            'bfh',
            'bfi',
            'bfj',
            'bfk',
            'bfl',
            'bfm',
            'bfn',
            'bfo',
            'bfp',
            'bfq',
            'bfr',
            'bfs',
            'bft',
            'bfu',
            'bfw',
            'bfx',
            'bfy',
            'bfz',
            'bga',
            'bgb',
            'bgc',
            'bgd',
            'bge',
            'bgf',
            'bgg',
            'bgi',
            'bgj',
            'bgk',
            'bgl',
            'bgn',
            'bgo',
            'bgp',
            'bgq',
            'bgr',
            'bgs',
            'bgt',
            'bgu',
            'bgv',
            'bgw',
            'bgx',
            'bgy',
            'bgz',
            'bha',
            'bhb',
            'bhc',
            'bhd',
            'bhe',
            'bhf',
            'bhg',
            'bhh',
            'bhi',
            'bhj',
            'bhl',
            'bhm',
            'bhn',
            'bho',
            'bhp',
            'bhq',
            'bhr',
            'bhs',
            'bht',
            'bhu',
            'bhv',
            'bhw',
            'bhx',
            'bhy',
            'bhz',
            'bia',
            'bib',
            'bic',
            'bid',
            'bie',
            'bif',
            'big',
            'bij',
            'bik',
            'bil',
            'bim',
            'bin',
            'bio',
            'bip',
            'biq',
            'bir',
            'bit',
            'biu',
            'biv',
            'biw',
            'bix',
            'biy',
            'biz',
            'bja',
            'bjb',
            'bjc',
            'bje',
            'bjf',
            'bjg',
            'bjh',
            'bji',
            'bjj',
            'bjk',
            'bjl',
            'bjm',
            'bjn',
            'bjo',
            'bjp',
            'bjr',
            'bjs',
            'bjt',
            'bju',
            'bjv',
            'bjw',
            'bjx',
            'bjy',
            'bjz',
            'bka',
            'bkc',
            'bkd',
            'bkf',
            'bkg',
            'bkh',
            'bki',
            'bkj',
            'bkk',
            'bkl',
            'bkm',
            'bkn',
            'bko',
            'bkp',
            'bkq',
            'bkr',
            'bks',
            'bkt',
            'bku',
            'bkv',
            'bkw',
            'bkx',
            'bky',
            'bkz',
            'bla',
            'blb',
            'blc',
            'bld',
            'ble',
            'blf',
            'blg',
            'blh',
            'bli',
            'blj',
            'blk',
            'bll',
            'blm',
            'bln',
            'blo',
            'blp',
            'blq',
            'blr',
            'bls',
            'blt',
            'blv',
            'blw',
            'blx',
            'bly',
            'blz',
            'bma',
            'bmb',
            'bmc',
            'bmd',
            'bme',
            'bmf',
            'bmg',
            'bmh',
            'bmi',
            'bmj',
            'bmk',
            'bml',
            'bmm',
            'bmn',
            'bmo',
            'bmp',
            'bmq',
            'bmr',
            'bms',
            'bmt',
            'bmu',
            'bmv',
            'bmw',
            'bmx',
            'bmz',
            'bna',
            'bnb',
            'bnc',
            'bnd',
            'bne',
            'bnf',
            'bng',
            'bni',
            'bnj',
            'bnk',
            'bnl',
            'bnm',
            'bnn',
            'bno',
            'bnp',
            'bnq',
            'bnr',
            'bns',
            'bnt',
            'bnu',
            'bnv',
            'bnw',
            'bnx',
            'bny',
            'bnz',
            'boa',
            'bob',
            'boe',
            'bof',
            'bog',
            'boh',
            'boi',
            'boj',
            'bok',
            'bol',
            'bom',
            'bon',
            'boo',
            'bop',
            'boq',
            'bor',
            'bot',
            'bou',
            'bov',
            'bow',
            'box',
            'boy',
            'boz',
            'bpa',
            'bpb',
            'bpd',
            'bpg',
            'bph',
            'bpi',
            'bpj',
            'bpk',
            'bpl',
            'bpm',
            'bpn',
            'bpo',
            'bpp',
            'bpq',
            'bpr',
            'bps',
            'bpt',
            'bpu',
            'bpv',
            'bpw',
            'bpx',
            'bpy',
            'bpz',
            'bqa',
            'bqb',
            'bqc',
            'bqd',
            'bqf',
            'bqg',
            'bqh',
            'bqi',
            'bqj',
            'bqk',
            'bql',
            'bqm',
            'bqn',
            'bqo',
            'bqp',
            'bqq',
            'bqr',
            'bqs',
            'bqt',
            'bqu',
            'bqv',
            'bqw',
            'bqx',
            'bqy',
            'bqz',
            'bra',
            'brb',
            'brc',
            'brd',
            'brf',
            'brg',
            'brh',
            'bri',
            'brj',
            'brk',
            'brl',
            'brm',
            'brn',
            'bro',
            'brp',
            'brq',
            'brr',
            'brs',
            'brt',
            'bru',
            'brv',
            'brw',
            'brx',
            'bry',
            'brz',
            'bsa',
            'bsb',
            'bsc',
            'bse',
            'bsf',
            'bsg',
            'bsh',
            'bsi',
            'bsj',
            'bsk',
            'bsl',
            'bsm',
            'bsn',
            'bso',
            'bsp',
            'bsq',
            'bsr',
            'bss',
            'bst',
            'bsu',
            'bsv',
            'bsw',
            'bsx',
            'bsy',
            'bta',
            'btc',
            'btd',
            'bte',
            'btf',
            'btg',
            'bth',
            'bti',
            'btj',
            'btk',
            'btm',
            'btn',
            'bto',
            'btp',
            'btq',
            'btr',
            'bts',
            'btt',
            'btu',
            'btv',
            'btw',
            'btx',
            'bty',
            'btz',
            'bua',
            'bub',
            'buc',
            'bud',
            'bue',
            'buf',
            'bug',
            'buh',
            'bui',
            'buj',
            'buk',
            'bum',
            'bun',
            'buo',
            'bup',
            'buq',
            'bus',
            'but',
            'buu',
            'buv',
            'buw',
            'bux',
            'buy',
            'buz',
            'bva',
            'bvb',
            'bvc',
            'bvd',
            'bve',
            'bvf',
            'bvg',
            'bvh',
            'bvi',
            'bvj',
            'bvk',
            'bvl',
            'bvm',
            'bvn',
            'bvo',
            'bvp',
            'bvq',
            'bvr',
            'bvt',
            'bvu',
            'bvv',
            'bvw',
            'bvx',
            'bvy',
            'bvz',
            'bwa',
            'bwb',
            'bwc',
            'bwd',
            'bwe',
            'bwf',
            'bwg',
            'bwh',
            'bwi',
            'bwj',
            'bwk',
            'bwl',
            'bwm',
            'bwn',
            'bwo',
            'bwp',
            'bwq',
            'bwr',
            'bws',
            'bwt',
            'bwu',
            'bww',
            'bwx',
            'bwy',
            'bwz',
            'bxa',
            'bxb',
            'bxc',
            'bxd',
            'bxe',
            'bxf',
            'bxg',
            'bxh',
            'bxi',
            'bxj',
            'bxk',
            'bxl',
            'bxm',
            'bxn',
            'bxo',
            'bxp',
            'bxq',
            'bxr',
            'bxs',
            'bxu',
            'bxv',
            'bxw',
            'bxz',
            'bya',
            'byb',
            'byc',
            'byd',
            'bye',
            'byf',
            'byg',
            'byh',
            'byi',
            'byj',
            'byk',
            'byl',
            'bym',
            'byn',
            'byo',
            'byp',
            'byq',
            'byr',
            'bys',
            'byt',
            'byv',
            'byw',
            'byx',
            'byz',
            'bza',
            'bzb',
            'bzc',
            'bzd',
            'bze',
            'bzf',
            'bzg',
            'bzh',
            'bzi',
            'bzj',
            'bzk',
            'bzl',
            'bzm',
            'bzn',
            'bzo',
            'bzp',
            'bzq',
            'bzr',
            'bzs',
            'bzt',
            'bzu',
            'bzv',
            'bzw',
            'bzx',
            'bzy',
            'bzz',
            'caa',
            'cab',
            'cac',
            'cad',
            'cae',
            'caf',
            'cag',
            'cah',
            'cai',
            'caj',
            'cak',
            'cal',
            'cam',
            'can',
            'cao',
            'cap',
            'caq',
            'car',
            'cas',
            'cau',
            'cav',
            'caw',
            'cax',
            'cay',
            'caz',
            'cba',
            'cbb',
            'cbc',
            'cbd',
            'cbg',
            'cbi',
            'cbj',
            'cbk',
            'cbl',
            'cbn',
            'cbo',
            'cbq',
            'cbr',
            'cbs',
            'cbt',
            'cbu',
            'cbv',
            'cbw',
            'cby',
            'cca',
            'ccc',
            'ccd',
            'cce',
            'ccg',
            'cch',
            'ccj',
            'ccl',
            'ccm',
            'ccn',
            'cco',
            'ccp',
            'ccr',
            'ccs',
            'cda',
            'cdc',
            'cdd',
            'cde',
            'cdf',
            'cdg',
            'cdh',
            'cdi',
            'cdj',
            'cdm',
            'cdn',
            'cdo',
            'cdr',
            'cds',
            'cdy',
            'cdz',
            'cea',
            'ceb',
            'ceg',
            'cek',
            'cel',
            'cen',
            'cet',
            'cfa',
            'cfd',
            'cfg',
            'cfm',
            'cga',
            'cgc',
            'cgg',
            'cgk',
            'chb',
            'chc',
            'chd',
            'chf',
            'chg',
            'chh',
            'chj',
            'chk',
            'chl',
            'chm',
            'chn',
            'cho',
            'chp',
            'chq',
            'chr',
            'cht',
            'chw',
            'chx',
            'chy',
            'chz',
            'cia',
            'cib',
            'cic',
            'cid',
            'cie',
            'cih',
            'cik',
            'cim',
            'cin',
            'cip',
            'cir',
            'ciw',
            'ciy',
            'cja',
            'cje',
            'cjh',
            'cji',
            'cjk',
            'cjm',
            'cjn',
            'cjo',
            'cjp',
            'cjs',
            'cjv',
            'cjy',
            'ckb',
            'ckh',
            'ckl',
            'ckn',
            'cko',
            'ckq',
            'ckr',
            'cks',
            'ckt',
            'cku',
            'ckv',
            'ckx',
            'cky',
            'ckz',
            'cla',
            'clc',
            'cld',
            'cle',
            'clh',
            'cli',
            'clj',
            'clk',
            'cll',
            'clm',
            'clo',
            'clt',
            'clu',
            'clw',
            'cly',
            'cma',
            'cmc',
            'cme',
            'cmg',
            'cmi',
            'cml',
            'cmm',
            'cmn',
            'cmo',
            'cmr',
            'cms',
            'cmt',
            'cna',
            'cnb',
            'cnc',
            'cng',
            'cnh',
            'cni',
            'cnk',
            'cnl',
            'cno',
            'cnr',
            'cns',
            'cnt',
            'cnu',
            'cnw',
            'cnx',
            'coa',
            'cob',
            'coc',
            'cod',
            'coe',
            'cof',
            'cog',
            'coh',
            'coj',
            'cok',
            'col',
            'com',
            'con',
            'coo',
            'cop',
            'coq',
            'cot',
            'cou',
            'cov',
            'cow',
            'cox',
            'coz',
            'cpa',
            'cpb',
            'cpc',
            'cpe',
            'cpf',
            'cpg',
            'cpi',
            'cpn',
            'cpo',
            'cpp',
            'cps',
            'cpu',
            'cpx',
            'cpy',
            'cqd',
            'cra',
            'crb',
            'crc',
            'crd',
            'crf',
            'crg',
            'crh',
            'cri',
            'crj',
            'crk',
            'crl',
            'crm',
            'crn',
            'cro',
            'crp',
            'crq',
            'crr',
            'crs',
            'crt',
            'crv',
            'crw',
            'crx',
            'cry',
            'crz',
            'csa',
            'csb',
            'csc',
            'csd',
            'cse',
            'csf',
            'csg',
            'csh',
            'csi',
            'csj',
            'csk',
            'csl',
            'csm',
            'csn',
            'cso',
            'csq',
            'csr',
            'css',
            'cst',
            'csu',
            'csv',
            'csw',
            'csy',
            'csz',
            'cta',
            'ctc',
            'ctd',
            'cte',
            'ctg',
            'cth',
            'ctl',
            'ctm',
            'ctn',
            'cto',
            'ctp',
            'cts',
            'ctt',
            'ctu',
            'ctz',
            'cua',
            'cub',
            'cuc',
            'cug',
            'cuh',
            'cui',
            'cuj',
            'cuk',
            'cul',
            'cuo',
            'cup',
            'cuq',
            'cur',
            'cus',
            'cut',
            'cuu',
            'cuv',
            'cuw',
            'cux',
            'cuy',
            'cvg',
            'cvn',
            'cwa',
            'cwb',
            'cwd',
            'cwe',
            'cwg',
            'cwt',
            'cya',
            'cyb',
            'cyo',
            'czh',
            'czk',
            'czn',
            'czo',
            'czt',
            'daa',
            'dac',
            'dad',
            'dae',
            'dag',
            'dah',
            'dai',
            'daj',
            'dak',
            'dal',
            'dam',
            'dao',
            'daq',
            'dar',
            'das',
            'dau',
            'dav',
            'daw',
            'dax',
            'day',
            'daz',
            'dba',
            'dbb',
            'dbd',
            'dbe',
            'dbf',
            'dbg',
            'dbi',
            'dbj',
            'dbl',
            'dbm',
            'dbn',
            'dbo',
            'dbp',
            'dbq',
            'dbr',
            'dbt',
            'dbu',
            'dbv',
            'dbw',
            'dby',
            'dcc',
            'dcr',
            'dda',
            'ddd',
            'dde',
            'ddg',
            'ddi',
            'ddj',
            'ddn',
            'ddo',
            'ddr',
            'dds',
            'ddw',
            'dec',
            'ded',
            'dee',
            'def',
            'deg',
            'deh',
            'dei',
            'dek',
            'del',
            'dem',
            'den',
            'dep',
            'deq',
            'der',
            'des',
            'dev',
            'dez',
            'dga',
            'dgb',
            'dgc',
            'dgd',
            'dge',
            'dgg',
            'dgh',
            'dgi',
            'dgk',
            'dgl',
            'dgn',
            'dgo',
            'dgr',
            'dgs',
            'dgt',
            'dgu',
            'dgw',
            'dgx',
            'dgz',
            'dhd',
            'dhg',
            'dhi',
            'dhl',
            'dhm',
            'dhn',
            'dho',
            'dhr',
            'dhs',
            'dhu',
            'dhv',
            'dhw',
            'dhx',
            'dia',
            'dib',
            'dic',
            'did',
            'dif',
            'dig',
            'dih',
            'dii',
            'dij',
            'dik',
            'dil',
            'dim',
            'din',
            'dio',
            'dip',
            'diq',
            'dir',
            'dis',
            'dit',
            'diu',
            'diw',
            'dix',
            'diy',
            'diz',
            'dja',
            'djb',
            'djc',
            'djd',
            'dje',
            'djf',
            'dji',
            'djj',
            'djk',
            'djm',
            'djn',
            'djo',
            'djr',
            'dju',
            'djw',
            'dka',
            'dkk',
            'dkr',
            'dks',
            'dkx',
            'dlg',
            'dlk',
            'dlm',
            'dln',
            'dma',
            'dmb',
            'dmc',
            'dmd',
            'dme',
            'dmg',
            'dmk',
            'dml',
            'dmm',
            'dmn',
            'dmo',
            'dmr',
            'dms',
            'dmu',
            'dmv',
            'dmw',
            'dmx',
            'dmy',
            'dna',
            'dnd',
            'dne',
            'dng',
            'dni',
            'dnj',
            'dnk',
            'dnn',
            'dnr',
            'dnt',
            'dnu',
            'dnv',
            'dnw',
            'dny',
            'doa',
            'dob',
            'doc',
            'doe',
            'dof',
            'doh',
            'doi',
            'dok',
            'dol',
            'don',
            'doo',
            'dop',
            'doq',
            'dor',
            'dos',
            'dot',
            'dov',
            'dow',
            'dox',
            'doy',
            'doz',
            'dpp',
            'dra',
            'drb',
            'drc',
            'drd',
            'dre',
            'drg',
            'dri',
            'drl',
            'drn',
            'dro',
            'drq',
            'drr',
            'drs',
            'drt',
            'dru',
            'dry',
            'dsb',
            'dse',
            'dsh',
            'dsi',
            'dsl',
            'dsn',
            'dso',
            'dsq',
            'dta',
            'dtb',
            'dtd',
            'dth',
            'dti',
            'dtk',
            'dtm',
            'dtn',
            'dto',
            'dtp',
            'dtr',
            'dts',
            'dtt',
            'dtu',
            'dty',
            'dua',
            'dub',
            'duc',
            'dud',
            'due',
            'duf',
            'dug',
            'duh',
            'dui',
            'duk',
            'dul',
            'dum',
            'dun',
            'duo',
            'dup',
            'duq',
            'dur',
            'dus',
            'duu',
            'duv',
            'duw',
            'dux',
            'duy',
            'duz',
            'dva',
            'dwa',
            'dwr',
            'dws',
            'dwu',
            'dww',
            'dwy',
            'dya',
            'dyb',
            'dyd',
            'dyg',
            'dyi',
            'dym',
            'dyn',
            'dyo',
            'dyu',
            'dyy',
            'dza',
            'dze',
            'dzg',
            'dzl',
            'dzn',
            'eaa',
            'ebg',
            'ebk',
            'ebo',
            'ebr',
            'ebu',
            'ecr',
            'ecs',
            'ecy',
            'eee',
            'efa',
            'efe',
            'efi',
            'ega',
            'egl',
            'ego',
            'egx',
            'egy',
            'ehu',
            'eip',
            'eit',
            'eiv',
            'eja',
            'eka',
            'ekc',
            'eke',
            'ekg',
            'eki',
            'ekk',
            'ekl',
            'ekm',
            'eko',
            'ekp',
            'ekr',
            'eky',
            'ele',
            'elh',
            'eli',
            'elk',
            'elm',
            'elo',
            'elu',
            'elx',
            'ema',
            'emb',
            'eme',
            'emg',
            'emi',
            'emk',
            'emm',
            'emn',
            'emp',
            'ems',
            'emu',
            'emw',
            'emx',
            'emy',
            'ena',
            'enb',
            'enc',
            'end',
            'enf',
            'enh',
            'enl',
            'enm',
            'enn',
            'eno',
            'enq',
            'enr',
            'enu',
            'env',
            'enw',
            'enx',
            'eot',
            'epi',
            'era',
            'erg',
            'erh',
            'eri',
            'erk',
            'ero',
            'err',
            'ers',
            'ert',
            'erw',
            'ese',
            'esg',
            'esh',
            'esi',
            'esk',
            'esl',
            'esm',
            'esn',
            'eso',
            'esq',
            'ess',
            'esu',
            'esx',
            'esy',
            'etb',
            'etc',
            'eth',
            'etn',
            'eto',
            'etr',
            'ets',
            'ett',
            'etu',
            'etx',
            'etz',
            'euq',
            'eve',
            'evh',
            'evn',
            'ewo',
            'ext',
            'eya',
            'eyo',
            'eza',
            'eze',
            'faa',
            'fab',
            'fad',
            'faf',
            'fag',
            'fah',
            'fai',
            'faj',
            'fak',
            'fal',
            'fam',
            'fan',
            'fap',
            'far',
            'fat',
            'fau',
            'fax',
            'fay',
            'faz',
            'fbl',
            'fcs',
            'fer',
            'ffi',
            'ffm',
            'fgr',
            'fia',
            'fie',
            'fil',
            'fip',
            'fir',
            'fit',
            'fiu',
            'fiw',
            'fkk',
            'fkv',
            'fla',
            'flh',
            'fli',
            'fll',
            'fln',
            'flr',
            'fly',
            'fmp',
            'fmu',
            'fnb',
            'fng',
            'fni',
            'fod',
            'foi',
            'fom',
            'fon',
            'for',
            'fos',
            'fox',
            'fpe',
            'fqs',
            'frc',
            'frd',
            'frk',
            'frm',
            'fro',
            'frp',
            'frq',
            'frr',
            'frs',
            'frt',
            'fse',
            'fsl',
            'fss',
            'fub',
            'fuc',
            'fud',
            'fue',
            'fuf',
            'fuh',
            'fui',
            'fuj',
            'fum',
            'fun',
            'fuq',
            'fur',
            'fut',
            'fuu',
            'fuv',
            'fuy',
            'fvr',
            'fwa',
            'fwe',
            'gaa',
            'gab',
            'gac',
            'gad',
            'gae',
            'gaf',
            'gag',
            'gah',
            'gai',
            'gaj',
            'gak',
            'gal',
            'gam',
            'gan',
            'gao',
            'gap',
            'gaq',
            'gar',
            'gas',
            'gat',
            'gau',
            'gaw',
            'gax',
            'gay',
            'gaz',
            'gba',
            'gbb',
            'gbd',
            'gbe',
            'gbf',
            'gbg',
            'gbh',
            'gbi',
            'gbj',
            'gbk',
            'gbl',
            'gbm',
            'gbn',
            'gbo',
            'gbp',
            'gbq',
            'gbr',
            'gbs',
            'gbu',
            'gbv',
            'gbw',
            'gbx',
            'gby',
            'gbz',
            'gcc',
            'gcd',
            'gce',
            'gcf',
            'gcl',
            'gcn',
            'gcr',
            'gct',
            'gda',
            'gdb',
            'gdc',
            'gdd',
            'gde',
            'gdf',
            'gdg',
            'gdh',
            'gdi',
            'gdj',
            'gdk',
            'gdl',
            'gdm',
            'gdn',
            'gdo',
            'gdq',
            'gdr',
            'gds',
            'gdt',
            'gdu',
            'gdx',
            'gea',
            'geb',
            'gec',
            'ged',
            'geg',
            'geh',
            'gei',
            'gej',
            'gek',
            'gel',
            'gem',
            'geq',
            'ges',
            'gev',
            'gew',
            'gex',
            'gey',
            'gez',
            'gfk',
            'gft',
            'gga',
            'ggb',
            'ggd',
            'gge',
            'ggg',
            'ggk',
            'ggl',
            'ggt',
            'ggu',
            'ggw',
            'gha',
            'ghc',
            'ghe',
            'ghh',
            'ghk',
            'ghl',
            'ghn',
            'gho',
            'ghr',
            'ghs',
            'ght',
            'gia',
            'gib',
            'gic',
            'gid',
            'gie',
            'gig',
            'gih',
            'gil',
            'gim',
            'gin',
            'gip',
            'giq',
            'gir',
            'gis',
            'git',
            'giu',
            'giw',
            'gix',
            'giy',
            'giz',
            'gji',
            'gjk',
            'gjm',
            'gjn',
            'gjr',
            'gju',
            'gka',
            'gkd',
            'gke',
            'gkn',
            'gko',
            'gkp',
            'gku',
            'glc',
            'gld',
            'glh',
            'gli',
            'glj',
            'glk',
            'gll',
            'glo',
            'glr',
            'glu',
            'glw',
            'gly',
            'gma',
            'gmb',
            'gmd',
            'gme',
            'gmg',
            'gmh',
            'gml',
            'gmm',
            'gmn',
            'gmq',
            'gmu',
            'gmv',
            'gmw',
            'gmx',
            'gmy',
            'gmz',
            'gna',
            'gnb',
            'gnc',
            'gnd',
            'gne',
            'gng',
            'gnh',
            'gni',
            'gnj',
            'gnk',
            'gnl',
            'gnm',
            'gnn',
            'gno',
            'gnq',
            'gnr',
            'gnt',
            'gnu',
            'gnw',
            'gnz',
            'goa',
            'gob',
            'goc',
            'god',
            'goe',
            'gof',
            'gog',
            'goh',
            'goi',
            'goj',
            'gok',
            'gol',
            'gom',
            'gon',
            'goo',
            'gop',
            'goq',
            'gor',
            'gos',
            'got',
            'gou',
            'gow',
            'gox',
            'goy',
            'goz',
            'gpa',
            'gpe',
            'gpn',
            'gqa',
            'gqi',
            'gqn',
            'gqr',
            'gqu',
            'gra',
            'grb',
            'grc',
            'grd',
            'grg',
            'grh',
            'gri',
            'grj',
            'grk',
            'grm',
            'gro',
            'grq',
            'grr',
            'grs',
            'grt',
            'gru',
            'grv',
            'grw',
            'grx',
            'gry',
            'grz',
            'gse',
            'gsg',
            'gsl',
            'gsm',
            'gsn',
            'gso',
            'gsp',
            'gss',
            'gsw',
            'gta',
            'gtu',
            'gua',
            'gub',
            'guc',
            'gud',
            'gue',
            'guf',
            'gug',
            'guh',
            'gui',
            'guk',
            'gul',
            'gum',
            'gun',
            'guo',
            'gup',
            'guq',
            'gur',
            'gus',
            'gut',
            'guu',
            'guw',
            'gux',
            'guz',
            'gva',
            'gvc',
            'gve',
            'gvf',
            'gvj',
            'gvl',
            'gvm',
            'gvn',
            'gvo',
            'gvp',
            'gvr',
            'gvs',
            'gvy',
            'gwa',
            'gwb',
            'gwc',
            'gwd',
            'gwe',
            'gwf',
            'gwg',
            'gwi',
            'gwj',
            'gwm',
            'gwn',
            'gwr',
            'gwt',
            'gwu',
            'gww',
            'gwx',
            'gxx',
            'gya',
            'gyb',
            'gyd',
            'gye',
            'gyf',
            'gyg',
            'gyi',
            'gyl',
            'gym',
            'gyn',
            'gyo',
            'gyr',
            'gyy',
            'gza',
            'gzi',
            'gzn',
            'haa',
            'hab',
            'hac',
            'had',
            'hae',
            'haf',
            'hag',
            'hah',
            'hai',
            'haj',
            'hak',
            'hal',
            'ham',
            'han',
            'hao',
            'hap',
            'haq',
            'har',
            'has',
            'hav',
            'haw',
            'hax',
            'hay',
            'haz',
            'hba',
            'hbb',
            'hbn',
            'hbo',
            'hbu',
            'hca',
            'hch',
            'hdn',
            'hds',
            'hdy',
            'hea',
            'hed',
            'heg',
            'heh',
            'hei',
            'hem',
            'hgm',
            'hgw',
            'hhi',
            'hhr',
            'hhy',
            'hia',
            'hib',
            'hid',
            'hif',
            'hig',
            'hih',
            'hii',
            'hij',
            'hik',
            'hil',
            'him',
            'hio',
            'hir',
            'hit',
            'hiw',
            'hix',
            'hji',
            'hka',
            'hke',
            'hkk',
            'hkn',
            'hks',
            'hla',
            'hlb',
            'hld',
            'hle',
            'hlt',
            'hlu',
            'hma',
            'hmb',
            'hmc',
            'hmd',
            'hme',
            'hmf',
            'hmg',
            'hmh',
            'hmi',
            'hmj',
            'hmk',
            'hml',
            'hmm',
            'hmn',
            'hmp',
            'hmq',
            'hmr',
            'hms',
            'hmt',
            'hmu',
            'hmv',
            'hmw',
            'hmx',
            'hmy',
            'hmz',
            'hna',
            'hnd',
            'hne',
            'hnh',
            'hni',
            'hnj',
            'hnn',
            'hno',
            'hns',
            'hnu',
            'hoa',
            'hob',
            'hoc',
            'hod',
            'hoe',
            'hoh',
            'hoi',
            'hoj',
            'hok',
            'hol',
            'hom',
            'hoo',
            'hop',
            'hor',
            'hos',
            'hot',
            'hov',
            'how',
            'hoy',
            'hoz',
            'hpo',
            'hps',
            'hra',
            'hrc',
            'hre',
            'hrk',
            'hrm',
            'hro',
            'hrp',
            'hrt',
            'hru',
            'hrw',
            'hrx',
            'hrz',
            'hsb',
            'hsh',
            'hsl',
            'hsn',
            'hss',
            'hti',
            'hto',
            'hts',
            'htu',
            'htx',
            'hub',
            'huc',
            'hud',
            'hue',
            'huf',
            'hug',
            'huh',
            'hui',
            'huj',
            'huk',
            'hul',
            'hum',
            'huo',
            'hup',
            'huq',
            'hur',
            'hus',
            'hut',
            'huu',
            'huv',
            'huw',
            'hux',
            'huy',
            'huz',
            'hvc',
            'hve',
            'hvk',
            'hvn',
            'hvv',
            'hwa',
            'hwc',
            'hwo',
            'hya',
            'hyw',
            'hyx',
            'iai',
            'ian',
            'iar',
            'iba',
            'ibb',
            'ibd',
            'ibe',
            'ibg',
            'ibh',
            'ibl',
            'ibm',
            'ibn',
            'ibr',
            'ibu',
            'iby',
            'ica',
            'ich',
            'icl',
            'icr',
            'ida',
            'idb',
            'idc',
            'idd',
            'ide',
            'idi',
            'idr',
            'ids',
            'idt',
            'idu',
            'ifa',
            'ifb',
            'ife',
            'iff',
            'ifk',
            'ifm',
            'ifu',
            'ify',
            'igb',
            'ige',
            'igg',
            'igl',
            'igm',
            'ign',
            'igo',
            'igs',
            'igw',
            'ihb',
            'ihi',
            'ihp',
            'ihw',
            'iin',
            'iir',
            'ijc',
            'ije',
            'ijj',
            'ijn',
            'ijo',
            'ijs',
            'ike',
            'iki',
            'ikk',
            'ikl',
            'iko',
            'ikp',
            'ikr',
            'iks',
            'ikt',
            'ikv',
            'ikw',
            'ikx',
            'ikz',
            'ila',
            'ilb',
            'ilg',
            'ili',
            'ilk',
            'ilm',
            'ilo',
            'ilp',
            'ils',
            'ilu',
            'ilv',
            'ima',
            'imi',
            'iml',
            'imn',
            'imo',
            'imr',
            'ims',
            'imy',
            'inb',
            'inc',
            'ine',
            'ing',
            'inh',
            'inj',
            'inl',
            'inm',
            'inn',
            'ino',
            'inp',
            'ins',
            'int',
            'inz',
            'ior',
            'iou',
            'iow',
            'ipi',
            'ipo',
            'iqu',
            'iqw',
            'ira',
            'ire',
            'irh',
            'iri',
            'irk',
            'irn',
            'iro',
            'irr',
            'iru',
            'irx',
            'iry',
            'isa',
            'isc',
            'isd',
            'ise',
            'isg',
            'ish',
            'isi',
            'isk',
            'ism',
            'isn',
            'iso',
            'isr',
            'ist',
            'isu',
            'itb',
            'itc',
            'itd',
            'ite',
            'iti',
            'itk',
            'itl',
            'itm',
            'ito',
            'itr',
            'its',
            'itt',
            'itv',
            'itw',
            'itx',
            'ity',
            'itz',
            'ium',
            'ivb',
            'ivv',
            'iwk',
            'iwm',
            'iwo',
            'iws',
            'ixc',
            'ixl',
            'iya',
            'iyo',
            'iyx',
            'izh',
            'izr',
            'izz',
            'jaa',
            'jab',
            'jac',
            'jad',
            'jae',
            'jaf',
            'jah',
            'jaj',
            'jak',
            'jal',
            'jam',
            'jan',
            'jao',
            'jaq',
            'jas',
            'jat',
            'jau',
            'jax',
            'jay',
            'jaz',
            'jbe',
            'jbi',
            'jbj',
            'jbk',
            'jbn',
            'jbo',
            'jbr',
            'jbt',
            'jbu',
            'jbw',
            'jcs',
            'jct',
            'jda',
            'jdg',
            'jdt',
            'jeb',
            'jee',
            'jeh',
            'jei',
            'jek',
            'jel',
            'jen',
            'jer',
            'jet',
            'jeu',
            'jgb',
            'jge',
            'jgk',
            'jgo',
            'jhi',
            'jhs',
            'jia',
            'jib',
            'jic',
            'jid',
            'jie',
            'jig',
            'jih',
            'jii',
            'jil',
            'jim',
            'jio',
            'jiq',
            'jit',
            'jiu',
            'jiv',
            'jiy',
            'jje',
            'jjr',
            'jka',
            'jkm',
            'jko',
            'jkp',
            'jkr',
            'jku',
            'jle',
            'jls',
            'jma',
            'jmb',
            'jmc',
            'jmd',
            'jmi',
            'jml',
            'jmn',
            'jmr',
            'jms',
            'jmw',
            'jmx',
            'jna',
            'jnd',
            'jng',
            'jni',
            'jnj',
            'jnl',
            'jns',
            'job',
            'jod',
            'jog',
            'jor',
            'jos',
            'jow',
            'jpa',
            'jpr',
            'jpx',
            'jqr',
            'jra',
            'jrb',
            'jrr',
            'jrt',
            'jru',
            'jsl',
            'jua',
            'jub',
            'juc',
            'jud',
            'juh',
            'jui',
            'juk',
            'jul',
            'jum',
            'jun',
            'juo',
            'jup',
            'jur',
            'jus',
            'jut',
            'juu',
            'juw',
            'juy',
            'jvd',
            'jvn',
            'jwi',
            'jya',
            'jye',
            'jyy',
            'kaa',
            'kab',
            'kac',
            'kad',
            'kae',
            'kaf',
            'kag',
            'kah',
            'kai',
            'kaj',
            'kak',
            'kam',
            'kao',
            'kap',
            'kaq',
            'kar',
            'kav',
            'kaw',
            'kax',
            'kay',
            'kba',
            'kbb',
            'kbc',
            'kbd',
            'kbe',
            'kbg',
            'kbh',
            'kbi',
            'kbj',
            'kbk',
            'kbl',
            'kbm',
            'kbn',
            'kbo',
            'kbp',
            'kbq',
            'kbr',
            'kbs',
            'kbt',
            'kbu',
            'kbv',
            'kbw',
            'kbx',
            'kby',
            'kbz',
            'kca',
            'kcb',
            'kcc',
            'kcd',
            'kce',
            'kcf',
            'kcg',
            'kch',
            'kci',
            'kcj',
            'kck',
            'kcl',
            'kcm',
            'kcn',
            'kco',
            'kcp',
            'kcq',
            'kcr',
            'kcs',
            'kct',
            'kcu',
            'kcv',
            'kcw',
            'kcx',
            'kcy',
            'kcz',
            'kda',
            'kdc',
            'kdd',
            'kde',
            'kdf',
            'kdg',
            'kdh',
            'kdi',
            'kdj',
            'kdk',
            'kdl',
            'kdm',
            'kdn',
            'kdo',
            'kdp',
            'kdq',
            'kdr',
            'kdt',
            'kdu',
            'kdw',
            'kdx',
            'kdy',
            'kdz',
            'kea',
            'keb',
            'kec',
            'ked',
            'kee',
            'kef',
            'keg',
            'keh',
            'kei',
            'kej',
            'kek',
            'kel',
            'kem',
            'ken',
            'keo',
            'kep',
            'keq',
            'ker',
            'kes',
            'ket',
            'keu',
            'kev',
            'kew',
            'kex',
            'key',
            'kez',
            'kfa',
            'kfb',
            'kfc',
            'kfd',
            'kfe',
            'kff',
            'kfg',
            'kfh',
            'kfi',
            'kfj',
            'kfk',
            'kfl',
            'kfm',
            'kfn',
            'kfo',
            'kfp',
            'kfq',
            'kfr',
            'kfs',
            'kft',
            'kfu',
            'kfv',
            'kfw',
            'kfx',
            'kfy',
            'kfz',
            'kga',
            'kgb',
            'kge',
            'kgf',
            'kgg',
            'kgi',
            'kgj',
            'kgk',
            'kgl',
            'kgm',
            'kgn',
            'kgo',
            'kgp',
            'kgq',
            'kgr',
            'kgs',
            'kgt',
            'kgu',
            'kgv',
            'kgw',
            'kgx',
            'kgy',
            'kha',
            'khb',
            'khc',
            'khd',
            'khe',
            'khf',
            'khg',
            'khh',
            'khi',
            'khj',
            'khk',
            'khl',
            'khn',
            'kho',
            'khp',
            'khq',
            'khr',
            'khs',
            'kht',
            'khu',
            'khv',
            'khw',
            'khx',
            'khy',
            'khz',
            'kia',
            'kib',
            'kic',
            'kid',
            'kie',
            'kif',
            'kig',
            'kih',
            'kii',
            'kij',
            'kil',
            'kim',
            'kio',
            'kip',
            'kiq',
            'kis',
            'kit',
            'kiu',
            'kiv',
            'kiw',
            'kix',
            'kiy',
            'kiz',
            'kja',
            'kjb',
            'kjc',
            'kjd',
            'kje',
            'kjf',
            'kjg',
            'kjh',
            'kji',
            'kjj',
            'kjk',
            'kjl',
            'kjm',
            'kjn',
            'kjo',
            'kjp',
            'kjq',
            'kjr',
            'kjs',
            'kjt',
            'kju',
            'kjv',
            'kjx',
            'kjy',
            'kjz',
            'kka',
            'kkb',
            'kkc',
            'kkd',
            'kke',
            'kkf',
            'kkg',
            'kkh',
            'kki',
            'kkj',
            'kkk',
            'kkl',
            'kkm',
            'kkn',
            'kko',
            'kkp',
            'kkq',
            'kkr',
            'kks',
            'kkt',
            'kku',
            'kkv',
            'kkw',
            'kkx',
            'kky',
            'kkz',
            'kla',
            'klb',
            'klc',
            'kld',
            'kle',
            'klf',
            'klg',
            'klh',
            'kli',
            'klj',
            'klk',
            'kll',
            'klm',
            'kln',
            'klo',
            'klp',
            'klq',
            'klr',
            'kls',
            'klt',
            'klu',
            'klv',
            'klw',
            'klx',
            'kly',
            'klz',
            'kma',
            'kmb',
            'kmc',
            'kmd',
            'kme',
            'kmf',
            'kmg',
            'kmh',
            'kmi',
            'kmj',
            'kmk',
            'kml',
            'kmm',
            'kmn',
            'kmo',
            'kmp',
            'kmq',
            'kmr',
            'kms',
            'kmt',
            'kmu',
            'kmv',
            'kmw',
            'kmx',
            'kmy',
            'kmz',
            'kna',
            'knb',
            'knc',
            'knd',
            'kne',
            'knf',
            'kng',
            'kni',
            'knj',
            'knk',
            'knl',
            'knm',
            'knn',
            'kno',
            'knp',
            'knq',
            'knr',
            'kns',
            'knt',
            'knu',
            'knv',
            'knw',
            'knx',
            'kny',
            'knz',
            'koa',
            'koc',
            'kod',
            'koe',
            'kof',
            'kog',
            'koh',
            'koi',
            'kok',
            'kol',
            'koo',
            'kop',
            'koq',
            'kos',
            'kot',
            'kou',
            'kov',
            'kow',
            'koy',
            'koz',
            'kpa',
            'kpb',
            'kpc',
            'kpd',
            'kpe',
            'kpf',
            'kpg',
            'kph',
            'kpi',
            'kpj',
            'kpk',
            'kpl',
            'kpm',
            'kpn',
            'kpo',
            'kpq',
            'kpr',
            'kps',
            'kpt',
            'kpu',
            'kpv',
            'kpw',
            'kpx',
            'kpy',
            'kpz',
            'kqa',
            'kqb',
            'kqc',
            'kqd',
            'kqe',
            'kqf',
            'kqg',
            'kqh',
            'kqi',
            'kqj',
            'kqk',
            'kql',
            'kqm',
            'kqn',
            'kqo',
            'kqp',
            'kqq',
            'kqr',
            'kqs',
            'kqt',
            'kqu',
            'kqv',
            'kqw',
            'kqx',
            'kqy',
            'kqz',
            'kra',
            'krb',
            'krc',
            'krd',
            'kre',
            'krf',
            'krh',
            'kri',
            'krj',
            'krk',
            'krl',
            'krn',
            'kro',
            'krp',
            'krr',
            'krs',
            'krt',
            'kru',
            'krv',
            'krw',
            'krx',
            'kry',
            'krz',
            'ksa',
            'ksb',
            'ksc',
            'ksd',
            'kse',
            'ksf',
            'ksg',
            'ksh',
            'ksi',
            'ksj',
            'ksk',
            'ksl',
            'ksm',
            'ksn',
            'kso',
            'ksp',
            'ksq',
            'ksr',
            'kss',
            'kst',
            'ksu',
            'ksv',
            'ksw',
            'ksx',
            'ksy',
            'ksz',
            'kta',
            'ktb',
            'ktc',
            'ktd',
            'kte',
            'ktf',
            'ktg',
            'kth',
            'kti',
            'ktj',
            'ktk',
            'ktl',
            'ktm',
            'ktn',
            'kto',
            'ktp',
            'ktq',
            'kts',
            'ktt',
            'ktu',
            'ktv',
            'ktw',
            'ktx',
            'kty',
            'ktz',
            'kub',
            'kuc',
            'kud',
            'kue',
            'kuf',
            'kug',
            'kuh',
            'kui',
            'kuj',
            'kuk',
            'kul',
            'kum',
            'kun',
            'kuo',
            'kup',
            'kuq',
            'kus',
            'kut',
            'kuu',
            'kuv',
            'kuw',
            'kux',
            'kuy',
            'kuz',
            'kva',
            'kvb',
            'kvc',
            'kvd',
            'kve',
            'kvf',
            'kvg',
            'kvh',
            'kvi',
            'kvj',
            'kvk',
            'kvl',
            'kvm',
            'kvn',
            'kvo',
            'kvp',
            'kvq',
            'kvr',
            'kvt',
            'kvu',
            'kvv',
            'kvw',
            'kvx',
            'kvy',
            'kvz',
            'kwa',
            'kwb',
            'kwc',
            'kwd',
            'kwe',
            'kwf',
            'kwg',
            'kwh',
            'kwi',
            'kwj',
            'kwk',
            'kwl',
            'kwm',
            'kwn',
            'kwo',
            'kwp',
            'kwr',
            'kws',
            'kwt',
            'kwu',
            'kwv',
            'kww',
            'kwx',
            'kwy',
            'kwz',
            'kxa',
            'kxb',
            'kxc',
            'kxd',
            'kxf',
            'kxh',
            'kxi',
            'kxj',
            'kxk',
            'kxl',
            'kxm',
            'kxn',
            'kxo',
            'kxp',
            'kxq',
            'kxr',
            'kxs',
            'kxt',
            'kxu',
            'kxv',
            'kxw',
            'kxx',
            'kxy',
            'kxz',
            'kya',
            'kyb',
            'kyc',
            'kyd',
            'kye',
            'kyf',
            'kyg',
            'kyh',
            'kyi',
            'kyj',
            'kyk',
            'kyl',
            'kym',
            'kyn',
            'kyo',
            'kyp',
            'kyq',
            'kyr',
            'kys',
            'kyt',
            'kyu',
            'kyv',
            'kyw',
            'kyx',
            'kyy',
            'kyz',
            'kza',
            'kzb',
            'kzc',
            'kzd',
            'kze',
            'kzf',
            'kzg',
            'kzi',
            'kzk',
            'kzl',
            'kzm',
            'kzn',
            'kzo',
            'kzp',
            'kzq',
            'kzr',
            'kzs',
            'kzu',
            'kzv',
            'kzw',
            'kzx',
            'kzy',
            'kzz',
            'laa',
            'lab',
            'lac',
            'lad',
            'lae',
            'laf',
            'lag',
            'lah',
            'lai',
            'laj',
            'lak',
            'lal',
            'lam',
            'lan',
            'lap',
            'laq',
            'lar',
            'las',
            'lau',
            'law',
            'lax',
            'lay',
            'laz',
            'lba',
            'lbb',
            'lbc',
            'lbe',
            'lbf',
            'lbg',
            'lbi',
            'lbj',
            'lbk',
            'lbl',
            'lbm',
            'lbn',
            'lbo',
            'lbq',
            'lbr',
            'lbs',
            'lbt',
            'lbu',
            'lbv',
            'lbw',
            'lbx',
            'lby',
            'lbz',
            'lcc',
            'lcd',
            'lce',
            'lcf',
            'lch',
            'lcl',
            'lcm',
            'lcp',
            'lcq',
            'lcs',
            'lda',
            'ldb',
            'ldd',
            'ldg',
            'ldh',
            'ldi',
            'ldj',
            'ldk',
            'ldl',
            'ldm',
            'ldn',
            'ldo',
            'ldp',
            'ldq',
            'lea',
            'leb',
            'lec',
            'led',
            'lee',
            'lef',
            'leh',
            'lei',
            'lej',
            'lek',
            'lel',
            'lem',
            'len',
            'leo',
            'lep',
            'leq',
            'ler',
            'les',
            'let',
            'leu',
            'lev',
            'lew',
            'lex',
            'ley',
            'lez',
            'lfa',
            'lfn',
            'lga',
            'lgb',
            'lgg',
            'lgh',
            'lgi',
            'lgk',
            'lgl',
            'lgm',
            'lgn',
            'lgq',
            'lgr',
            'lgt',
            'lgu',
            'lgz',
            'lha',
            'lhh',
            'lhi',
            'lhl',
            'lhm',
            'lhn',
            'lhp',
            'lhs',
            'lht',
            'lhu',
            'lia',
            'lib',
            'lic',
            'lid',
            'lie',
            'lif',
            'lig',
            'lih',
            'lij',
            'lik',
            'lil',
            'lio',
            'lip',
            'liq',
            'lir',
            'lis',
            'liu',
            'liv',
            'liw',
            'lix',
            'liy',
            'liz',
            'lja',
            'lje',
            'lji',
            'ljl',
            'ljp',
            'ljw',
            'ljx',
            'lka',
            'lkb',
            'lkc',
            'lkd',
            'lke',
            'lkh',
            'lki',
            'lkj',
            'lkl',
            'lkm',
            'lkn',
            'lko',
            'lkr',
            'lks',
            'lkt',
            'lku',
            'lky',
            'lla',
            'llb',
            'llc',
            'lld',
            'lle',
            'llf',
            'llg',
            'llh',
            'lli',
            'llj',
            'llk',
            'lll',
            'llm',
            'lln',
            'llo',
            'llp',
            'llq',
            'lls',
            'llu',
            'llx',
            'lma',
            'lmb',
            'lmc',
            'lmd',
            'lme',
            'lmf',
            'lmg',
            'lmh',
            'lmi',
            'lmj',
            'lmk',
            'lml',
            'lmn',
            'lmo',
            'lmp',
            'lmq',
            'lmr',
            'lmu',
            'lmv',
            'lmw',
            'lmx',
            'lmy',
            'lmz',
            'lna',
            'lnb',
            'lnd',
            'lng',
            'lnh',
            'lni',
            'lnj',
            'lnl',
            'lnm',
            'lnn',
            'lno',
            'lns',
            'lnu',
            'lnw',
            'lnz',
            'loa',
            'lob',
            'loc',
            'loe',
            'lof',
            'log',
            'loh',
            'loi',
            'loj',
            'lok',
            'lol',
            'lom',
            'lon',
            'loo',
            'lop',
            'loq',
            'lor',
            'los',
            'lot',
            'lou',
            'lov',
            'low',
            'lox',
            'loy',
            'loz',
            'lpa',
            'lpe',
            'lpn',
            'lpo',
            'lpx',
            'lra',
            'lrc',
            'lre',
            'lrg',
            'lri',
            'lrk',
            'lrl',
            'lrm',
            'lrn',
            'lro',
            'lrr',
            'lrt',
            'lrv',
            'lrz',
            'lsa',
            'lsd',
            'lse',
            'lsh',
            'lsi',
            'lsl',
            'lsm',
            'lso',
            'lsp',
            'lsr',
            'lss',
            'lst',
            'lsy',
            'ltc',
            'ltg',
            'lth',
            'lti',
            'ltn',
            'lto',
            'lts',
            'ltu',
            'lua',
            'luc',
            'lud',
            'lue',
            'luf',
            'lui',
            'luj',
            'luk',
            'lul',
            'lum',
            'lun',
            'luo',
            'lup',
            'luq',
            'lur',
            'lus',
            'lut',
            'luu',
            'luv',
            'luw',
            'luy',
            'luz',
            'lva',
            'lvk',
            'lvs',
            'lvu',
            'lwa',
            'lwe',
            'lwg',
            'lwh',
            'lwl',
            'lwm',
            'lwo',
            'lws',
            'lwt',
            'lwu',
            'lww',
            'lya',
            'lyg',
            'lyn',
            'lzh',
            'lzl',
            'lzn',
            'lzz',
            'maa',
            'mab',
            'mad',
            'mae',
            'maf',
            'mag',
            'mai',
            'maj',
            'mak',
            'mam',
            'man',
            'map',
            'maq',
            'mas',
            'mat',
            'mau',
            'mav',
            'maw',
            'max',
            'maz',
            'mba',
            'mbb',
            'mbc',
            'mbd',
            'mbe',
            'mbf',
            'mbh',
            'mbi',
            'mbj',
            'mbk',
            'mbl',
            'mbm',
            'mbn',
            'mbo',
            'mbp',
            'mbq',
            'mbr',
            'mbs',
            'mbt',
            'mbu',
            'mbv',
            'mbw',
            'mbx',
            'mby',
            'mbz',
            'mca',
            'mcb',
            'mcc',
            'mcd',
            'mce',
            'mcf',
            'mcg',
            'mch',
            'mci',
            'mcj',
            'mck',
            'mcl',
            'mcm',
            'mcn',
            'mco',
            'mcp',
            'mcq',
            'mcr',
            'mcs',
            'mct',
            'mcu',
            'mcv',
            'mcw',
            'mcx',
            'mcy',
            'mcz',
            'mda',
            'mdb',
            'mdc',
            'mdd',
            'mde',
            'mdf',
            'mdg',
            'mdh',
            'mdi',
            'mdj',
            'mdk',
            'mdl',
            'mdm',
            'mdn',
            'mdp',
            'mdq',
            'mdr',
            'mds',
            'mdt',
            'mdu',
            'mdv',
            'mdw',
            'mdx',
            'mdy',
            'mdz',
            'mea',
            'meb',
            'mec',
            'med',
            'mee',
            'mef',
            'meh',
            'mei',
            'mej',
            'mek',
            'mel',
            'mem',
            'men',
            'meo',
            'mep',
            'meq',
            'mer',
            'mes',
            'met',
            'meu',
            'mev',
            'mew',
            'mey',
            'mez',
            'mfa',
            'mfb',
            'mfc',
            'mfd',
            'mfe',
            'mff',
            'mfg',
            'mfh',
            'mfi',
            'mfj',
            'mfk',
            'mfl',
            'mfm',
            'mfn',
            'mfo',
            'mfp',
            'mfq',
            'mfr',
            'mfs',
            'mft',
            'mfu',
            'mfv',
            'mfw',
            'mfx',
            'mfy',
            'mfz',
            'mga',
            'mgb',
            'mgc',
            'mgd',
            'mge',
            'mgf',
            'mgg',
            'mgh',
            'mgi',
            'mgj',
            'mgk',
            'mgl',
            'mgm',
            'mgn',
            'mgo',
            'mgp',
            'mgq',
            'mgr',
            'mgs',
            'mgt',
            'mgu',
            'mgv',
            'mgw',
            'mgy',
            'mgz',
            'mha',
            'mhb',
            'mhc',
            'mhd',
            'mhe',
            'mhf',
            'mhg',
            'mhi',
            'mhj',
            'mhk',
            'mhl',
            'mhm',
            'mhn',
            'mho',
            'mhp',
            'mhq',
            'mhr',
            'mhs',
            'mht',
            'mhu',
            'mhw',
            'mhx',
            'mhy',
            'mhz',
            'mia',
            'mib',
            'mic',
            'mid',
            'mie',
            'mif',
            'mig',
            'mih',
            'mii',
            'mij',
            'mik',
            'mil',
            'mim',
            'min',
            'mio',
            'mip',
            'miq',
            'mir',
            'mis',
            'mit',
            'miu',
            'miw',
            'mix',
            'miy',
            'miz',
            'mjb',
            'mjc',
            'mjd',
            'mje',
            'mjg',
            'mjh',
            'mji',
            'mjj',
            'mjk',
            'mjl',
            'mjm',
            'mjn',
            'mjo',
            'mjp',
            'mjq',
            'mjr',
            'mjs',
            'mjt',
            'mju',
            'mjv',
            'mjw',
            'mjx',
            'mjy',
            'mjz',
            'mka',
            'mkb',
            'mkc',
            'mke',
            'mkf',
            'mkg',
            'mkh',
            'mki',
            'mkj',
            'mkk',
            'mkl',
            'mkm',
            'mkn',
            'mko',
            'mkp',
            'mkq',
            'mkr',
            'mks',
            'mkt',
            'mku',
            'mkv',
            'mkw',
            'mkx',
            'mky',
            'mkz',
            'mla',
            'mlb',
            'mlc',
            'mle',
            'mlf',
            'mlh',
            'mli',
            'mlj',
            'mlk',
            'mll',
            'mlm',
            'mln',
            'mlo',
            'mlp',
            'mlq',
            'mlr',
            'mls',
            'mlu',
            'mlv',
            'mlw',
            'mlx',
            'mlz',
            'mma',
            'mmb',
            'mmc',
            'mmd',
            'mme',
            'mmf',
            'mmg',
            'mmh',
            'mmi',
            'mmj',
            'mmk',
            'mml',
            'mmm',
            'mmn',
            'mmo',
            'mmp',
            'mmq',
            'mmr',
            'mmt',
            'mmu',
            'mmv',
            'mmw',
            'mmx',
            'mmy',
            'mmz',
            'mna',
            'mnb',
            'mnc',
            'mnd',
            'mne',
            'mnf',
            'mng',
            'mnh',
            'mni',
            'mnj',
            'mnk',
            'mnl',
            'mnm',
            'mnn',
            'mno',
            'mnp',
            'mnq',
            'mnr',
            'mns',
            'mnu',
            'mnv',
            'mnw',
            'mnx',
            'mny',
            'mnz',
            'moa',
            'moc',
            'mod',
            'moe',
            'mog',
            'moh',
            'moi',
            'moj',
            'mok',
            'mom',
            'moo',
            'mop',
            'moq',
            'mor',
            'mos',
            'mot',
            'mou',
            'mov',
            'mow',
            'mox',
            'moy',
            'moz',
            'mpa',
            'mpb',
            'mpc',
            'mpd',
            'mpe',
            'mpg',
            'mph',
            'mpi',
            'mpj',
            'mpk',
            'mpl',
            'mpm',
            'mpn',
            'mpo',
            'mpp',
            'mpq',
            'mpr',
            'mps',
            'mpt',
            'mpu',
            'mpv',
            'mpw',
            'mpx',
            'mpy',
            'mpz',
            'mqa',
            'mqb',
            'mqc',
            'mqe',
            'mqf',
            'mqg',
            'mqh',
            'mqi',
            'mqj',
            'mqk',
            'mql',
            'mqm',
            'mqn',
            'mqo',
            'mqp',
            'mqq',
            'mqr',
            'mqs',
            'mqt',
            'mqu',
            'mqv',
            'mqw',
            'mqx',
            'mqy',
            'mqz',
            'mra',
            'mrb',
            'mrc',
            'mrd',
            'mre',
            'mrf',
            'mrg',
            'mrh',
            'mrj',
            'mrk',
            'mrl',
            'mrm',
            'mrn',
            'mro',
            'mrp',
            'mrq',
            'mrr',
            'mrs',
            'mrt',
            'mru',
            'mrv',
            'mrw',
            'mrx',
            'mry',
            'mrz',
            'msb',
            'msc',
            'msd',
            'mse',
            'msf',
            'msg',
            'msh',
            'msi',
            'msj',
            'msk',
            'msl',
            'msm',
            'msn',
            'mso',
            'msp',
            'msq',
            'msr',
            'mss',
            'msu',
            'msv',
            'msw',
            'msx',
            'msy',
            'msz',
            'mta',
            'mtb',
            'mtc',
            'mtd',
            'mte',
            'mtf',
            'mtg',
            'mth',
            'mti',
            'mtj',
            'mtk',
            'mtl',
            'mtm',
            'mtn',
            'mto',
            'mtp',
            'mtq',
            'mtr',
            'mts',
            'mtt',
            'mtu',
            'mtv',
            'mtw',
            'mtx',
            'mty',
            'mua',
            'mub',
            'muc',
            'mud',
            'mue',
            'mug',
            'muh',
            'mui',
            'muj',
            'muk',
            'mul',
            'mum',
            'mun',
            'muo',
            'mup',
            'muq',
            'mur',
            'mus',
            'mut',
            'muu',
            'muv',
            'mux',
            'muy',
            'muz',
            'mva',
            'mvb',
            'mvd',
            'mve',
            'mvf',
            'mvg',
            'mvh',
            'mvi',
            'mvk',
            'mvl',
            'mvm',
            'mvn',
            'mvo',
            'mvp',
            'mvq',
            'mvr',
            'mvs',
            'mvt',
            'mvu',
            'mvv',
            'mvw',
            'mvx',
            'mvy',
            'mvz',
            'mwa',
            'mwb',
            'mwc',
            'mwe',
            'mwf',
            'mwg',
            'mwh',
            'mwi',
            'mwk',
            'mwl',
            'mwm',
            'mwn',
            'mwo',
            'mwp',
            'mwq',
            'mwr',
            'mws',
            'mwt',
            'mwu',
            'mwv',
            'mww',
            'mwz',
            'mxa',
            'mxb',
            'mxc',
            'mxd',
            'mxe',
            'mxf',
            'mxg',
            'mxh',
            'mxi',
            'mxj',
            'mxk',
            'mxl',
            'mxm',
            'mxn',
            'mxo',
            'mxp',
            'mxq',
            'mxr',
            'mxs',
            'mxt',
            'mxu',
            'mxv',
            'mxw',
            'mxx',
            'mxy',
            'mxz',
            'myb',
            'myc',
            'myd',
            'mye',
            'myf',
            'myg',
            'myh',
            'myi',
            'myj',
            'myk',
            'myl',
            'mym',
            'myn',
            'myo',
            'myp',
            'myr',
            'mys',
            'myu',
            'myv',
            'myw',
            'myx',
            'myy',
            'myz',
            'mza',
            'mzb',
            'mzc',
            'mzd',
            'mze',
            'mzg',
            'mzh',
            'mzi',
            'mzj',
            'mzk',
            'mzl',
            'mzm',
            'mzn',
            'mzo',
            'mzp',
            'mzq',
            'mzr',
            'mzs',
            'mzt',
            'mzu',
            'mzv',
            'mzw',
            'mzx',
            'mzy',
            'mzz',
            'naa',
            'nab',
            'nac',
            'nae',
            'naf',
            'nag',
            'nah',
            'nai',
            'naj',
            'nak',
            'nal',
            'nam',
            'nan',
            'nao',
            'nap',
            'naq',
            'nar',
            'nas',
            'nat',
            'naw',
            'nax',
            'nay',
            'naz',
            'nba',
            'nbb',
            'nbc',
            'nbd',
            'nbe',
            'nbg',
            'nbh',
            'nbi',
            'nbj',
            'nbk',
            'nbm',
            'nbn',
            'nbo',
            'nbp',
            'nbq',
            'nbr',
            'nbs',
            'nbt',
            'nbu',
            'nbv',
            'nbw',
            'nby',
            'nca',
            'ncb',
            'ncc',
            'ncd',
            'nce',
            'ncf',
            'ncg',
            'nch',
            'nci',
            'ncj',
            'nck',
            'ncl',
            'ncm',
            'ncn',
            'nco',
            'ncq',
            'ncr',
            'ncs',
            'nct',
            'ncu',
            'ncx',
            'ncz',
            'nda',
            'ndb',
            'ndc',
            'ndd',
            'ndf',
            'ndg',
            'ndh',
            'ndi',
            'ndj',
            'ndk',
            'ndl',
            'ndm',
            'ndn',
            'ndp',
            'ndq',
            'ndr',
            'nds',
            'ndt',
            'ndu',
            'ndv',
            'ndw',
            'ndx',
            'ndy',
            'ndz',
            'nea',
            'neb',
            'nec',
            'ned',
            'nee',
            'nef',
            'neg',
            'neh',
            'nei',
            'nej',
            'nek',
            'nem',
            'nen',
            'neo',
            'neq',
            'ner',
            'nes',
            'net',
            'neu',
            'nev',
            'new',
            'nex',
            'ney',
            'nez',
            'nfa',
            'nfd',
            'nfl',
            'nfr',
            'nfu',
            'nga',
            'ngb',
            'ngc',
            'ngd',
            'nge',
            'ngf',
            'ngg',
            'ngh',
            'ngi',
            'ngj',
            'ngk',
            'ngl',
            'ngm',
            'ngn',
            'ngo',
            'ngp',
            'ngq',
            'ngr',
            'ngs',
            'ngt',
            'ngu',
            'ngv',
            'ngw',
            'ngx',
            'ngy',
            'ngz',
            'nha',
            'nhb',
            'nhc',
            'nhd',
            'nhe',
            'nhf',
            'nhg',
            'nhh',
            'nhi',
            'nhk',
            'nhm',
            'nhn',
            'nho',
            'nhp',
            'nhq',
            'nhr',
            'nht',
            'nhu',
            'nhv',
            'nhw',
            'nhx',
            'nhy',
            'nhz',
            'nia',
            'nib',
            'nic',
            'nid',
            'nie',
            'nif',
            'nig',
            'nih',
            'nii',
            'nij',
            'nik',
            'nil',
            'nim',
            'nin',
            'nio',
            'niq',
            'nir',
            'nis',
            'nit',
            'niu',
            'niv',
            'niw',
            'nix',
            'niy',
            'niz',
            'nja',
            'njb',
            'njd',
            'njh',
            'nji',
            'njj',
            'njl',
            'njm',
            'njn',
            'njo',
            'njr',
            'njs',
            'njt',
            'nju',
            'njx',
            'njy',
            'njz',
            'nka',
            'nkb',
            'nkc',
            'nkd',
            'nke',
            'nkf',
            'nkg',
            'nkh',
            'nki',
            'nkj',
            'nkk',
            'nkm',
            'nkn',
            'nko',
            'nkp',
            'nkq',
            'nkr',
            'nks',
            'nkt',
            'nku',
            'nkv',
            'nkw',
            'nkx',
            'nkz',
            'nla',
            'nlc',
            'nle',
            'nlg',
            'nli',
            'nlj',
            'nlk',
            'nll',
            'nlm',
            'nlo',
            'nlq',
            'nlu',
            'nlv',
            'nlw',
            'nlx',
            'nly',
            'nlz',
            'nma',
            'nmb',
            'nmc',
            'nmd',
            'nme',
            'nmf',
            'nmg',
            'nmh',
            'nmi',
            'nmj',
            'nmk',
            'nml',
            'nmm',
            'nmn',
            'nmo',
            'nmp',
            'nmq',
            'nmr',
            'nms',
            'nmt',
            'nmu',
            'nmv',
            'nmw',
            'nmx',
            'nmy',
            'nmz',
            'nna',
            'nnb',
            'nnc',
            'nnd',
            'nne',
            'nnf',
            'nng',
            'nnh',
            'nni',
            'nnj',
            'nnk',
            'nnl',
            'nnm',
            'nnn',
            'nnp',
            'nnq',
            'nnr',
            'nns',
            'nnt',
            'nnu',
            'nnv',
            'nnw',
            'nny',
            'nnz',
            'noa',
            'noc',
            'nod',
            'noe',
            'nof',
            'nog',
            'noh',
            'noi',
            'noj',
            'nok',
            'nol',
            'nom',
            'non',
            'nop',
            'noq',
            'nos',
            'not',
            'nou',
            'nov',
            'now',
            'noy',
            'noz',
            'npa',
            'npb',
            'npg',
            'nph',
            'npi',
            'npl',
            'npn',
            'npo',
            'nps',
            'npu',
            'npx',
            'npy',
            'nqg',
            'nqk',
            'nql',
            'nqm',
            'nqn',
            'nqo',
            'nqq',
            'nqy',
            'nra',
            'nrb',
            'nrc',
            'nre',
            'nrf',
            'nrg',
            'nri',
            'nrk',
            'nrl',
            'nrm',
            'nrn',
            'nrp',
            'nrr',
            'nrt',
            'nru',
            'nrx',
            'nrz',
            'nsa',
            'nsc',
            'nsd',
            'nse',
            'nsf',
            'nsg',
            'nsh',
            'nsi',
            'nsk',
            'nsl',
            'nsm',
            'nsn',
            'nso',
            'nsp',
            'nsq',
            'nsr',
            'nss',
            'nst',
            'nsu',
            'nsv',
            'nsw',
            'nsx',
            'nsy',
            'nsz',
            'ntd',
            'nte',
            'ntg',
            'nti',
            'ntj',
            'ntk',
            'ntm',
            'nto',
            'ntp',
            'ntr',
            'ntu',
            'ntw',
            'ntx',
            'nty',
            'ntz',
            'nua',
            'nub',
            'nuc',
            'nud',
            'nue',
            'nuf',
            'nug',
            'nuh',
            'nui',
            'nuj',
            'nuk',
            'nul',
            'num',
            'nun',
            'nuo',
            'nup',
            'nuq',
            'nur',
            'nus',
            'nut',
            'nuu',
            'nuv',
            'nuw',
            'nux',
            'nuy',
            'nuz',
            'nvh',
            'nvm',
            'nvo',
            'nwa',
            'nwb',
            'nwc',
            'nwe',
            'nwg',
            'nwi',
            'nwm',
            'nwo',
            'nwr',
            'nwx',
            'nwy',
            'nxa',
            'nxd',
            'nxe',
            'nxg',
            'nxi',
            'nxk',
            'nxl',
            'nxm',
            'nxn',
            'nxo',
            'nxq',
            'nxr',
            'nxu',
            'nxx',
            'nyb',
            'nyc',
            'nyd',
            'nye',
            'nyf',
            'nyg',
            'nyh',
            'nyi',
            'nyj',
            'nyk',
            'nyl',
            'nym',
            'nyn',
            'nyo',
            'nyp',
            'nyq',
            'nyr',
            'nys',
            'nyt',
            'nyu',
            'nyv',
            'nyw',
            'nyx',
            'nyy',
            'nza',
            'nzb',
            'nzd',
            'nzi',
            'nzk',
            'nzm',
            'nzs',
            'nzu',
            'nzy',
            'nzz',
            'oaa',
            'oac',
            'oar',
            'oav',
            'obi',
            'obk',
            'obl',
            'obm',
            'obo',
            'obr',
            'obt',
            'obu',
            'oca',
            'och',
            'oco',
            'ocu',
            'oda',
            'odk',
            'odt',
            'odu',
            'ofo',
            'ofs',
            'ofu',
            'ogb',
            'ogc',
            'oge',
            'ogg',
            'ogo',
            'ogu',
            'oht',
            'ohu',
            'oia',
            'oin',
            'ojb',
            'ojc',
            'ojg',
            'ojp',
            'ojs',
            'ojv',
            'ojw',
            'oka',
            'okb',
            'okd',
            'oke',
            'okg',
            'okh',
            'oki',
            'okj',
            'okk',
            'okl',
            'okm',
            'okn',
            'oko',
            'okr',
            'oks',
            'oku',
            'okv',
            'okx',
            'ola',
            'old',
            'ole',
            'olk',
            'olm',
            'olo',
            'olr',
            'olt',
            'olu',
            'oma',
            'omb',
            'omc',
            'omg',
            'omi',
            'omk',
            'oml',
            'omn',
            'omo',
            'omp',
            'omq',
            'omr',
            'omt',
            'omu',
            'omv',
            'omw',
            'omx',
            'ona',
            'onb',
            'one',
            'ong',
            'oni',
            'onj',
            'onk',
            'onn',
            'ono',
            'onp',
            'onr',
            'ons',
            'ont',
            'onu',
            'onw',
            'onx',
            'ood',
            'oog',
            'oon',
            'oor',
            'oos',
            'opa',
            'opk',
            'opm',
            'opo',
            'opt',
            'opy',
            'ora',
            'orc',
            'ore',
            'org',
            'orh',
            'orn',
            'oro',
            'orr',
            'ors',
            'ort',
            'oru',
            'orv',
            'orw',
            'orx',
            'ory',
            'orz',
            'osa',
            'osc',
            'osi',
            'oso',
            'osp',
            'ost',
            'osu',
            'osx',
            'ota',
            'otb',
            'otd',
            'ote',
            'oti',
            'otk',
            'otl',
            'otm',
            'otn',
            'oto',
            'otq',
            'otr',
            'ots',
            'ott',
            'otu',
            'otw',
            'otx',
            'oty',
            'otz',
            'oua',
            'oub',
            'oue',
            'oui',
            'oum',
            'ovd',
            'owi',
            'owl',
            'oyb',
            'oyd',
            'oym',
            'oyy',
            'ozm',
            'paa',
            'pab',
            'pac',
            'pad',
            'pae',
            'paf',
            'pag',
            'pah',
            'pai',
            'pak',
            'pal',
            'pam',
            'pao',
            'pap',
            'paq',
            'par',
            'pas',
            'pat',
            'pau',
            'pav',
            'paw',
            'pax',
            'pay',
            'paz',
            'pbb',
            'pbc',
            'pbe',
            'pbf',
            'pbg',
            'pbh',
            'pbi',
            'pbl',
            'pbm',
            'pbn',
            'pbo',
            'pbp',
            'pbr',
            'pbs',
            'pbt',
            'pbu',
            'pbv',
            'pby',
            'pca',
            'pcb',
            'pcc',
            'pcd',
            'pce',
            'pcf',
            'pcg',
            'pch',
            'pci',
            'pcj',
            'pck',
            'pcl',
            'pcm',
            'pcn',
            'pcp',
            'pcw',
            'pda',
            'pdc',
            'pdi',
            'pdn',
            'pdo',
            'pdt',
            'pdu',
            'pea',
            'peb',
            'ped',
            'pee',
            'pef',
            'peg',
            'peh',
            'pei',
            'pej',
            'pek',
            'pel',
            'pem',
            'peo',
            'pep',
            'peq',
            'pes',
            'pev',
            'pex',
            'pey',
            'pez',
            'pfa',
            'pfe',
            'pfl',
            'pga',
            'pgd',
            'pgg',
            'pgi',
            'pgk',
            'pgl',
            'pgn',
            'pgs',
            'pgu',
            'pgz',
            'pha',
            'phd',
            'phg',
            'phh',
            'phi',
            'phk',
            'phl',
            'phm',
            'phn',
            'pho',
            'phq',
            'phr',
            'pht',
            'phu',
            'phv',
            'phw',
            'pia',
            'pib',
            'pic',
            'pid',
            'pie',
            'pif',
            'pig',
            'pih',
            'pii',
            'pij',
            'pil',
            'pim',
            'pin',
            'pio',
            'pip',
            'pir',
            'pis',
            'pit',
            'piu',
            'piv',
            'piw',
            'pix',
            'piy',
            'piz',
            'pjt',
            'pka',
            'pkb',
            'pkc',
            'pkg',
            'pkh',
            'pkn',
            'pko',
            'pkp',
            'pkr',
            'pks',
            'pkt',
            'pku',
            'pla',
            'plb',
            'plc',
            'pld',
            'ple',
            'plf',
            'plg',
            'plh',
            'plj',
            'plk',
            'pll',
            'pln',
            'plo',
            'plp',
            'plq',
            'plr',
            'pls',
            'plt',
            'plu',
            'plv',
            'plw',
            'ply',
            'plz',
            'pma',
            'pmb',
            'pmd',
            'pme',
            'pmf',
            'pmh',
            'pmi',
            'pmj',
            'pmk',
            'pml',
            'pmm',
            'pmn',
            'pmo',
            'pmq',
            'pmr',
            'pms',
            'pmt',
            'pmw',
            'pmx',
            'pmy',
            'pmz',
            'pna',
            'pnb',
            'pnc',
            'pne',
            'png',
            'pnh',
            'pni',
            'pnj',
            'pnk',
            'pnl',
            'pnm',
            'pnn',
            'pno',
            'pnp',
            'pnq',
            'pnr',
            'pns',
            'pnt',
            'pnu',
            'pnv',
            'pnw',
            'pnx',
            'pny',
            'pnz',
            'poc',
            'poe',
            'pof',
            'pog',
            'poh',
            'poi',
            'pok',
            'pom',
            'pon',
            'poo',
            'pop',
            'poq',
            'pos',
            'pot',
            'pov',
            'pow',
            'pox',
            'poy',
            'poz',
            'ppe',
            'ppi',
            'ppk',
            'ppl',
            'ppm',
            'ppn',
            'ppo',
            'ppp',
            'ppq',
            'pps',
            'ppt',
            'ppu',
            'pqa',
            'pqe',
            'pqm',
            'pqw',
            'pra',
            'prc',
            'prd',
            'pre',
            'prf',
            'prg',
            'prh',
            'pri',
            'prk',
            'prl',
            'prm',
            'prn',
            'pro',
            'prp',
            'prq',
            'prr',
            'prs',
            'prt',
            'pru',
            'prw',
            'prx',
            'prz',
            'psa',
            'psc',
            'psd',
            'pse',
            'psg',
            'psh',
            'psi',
            'psl',
            'psm',
            'psn',
            'pso',
            'psp',
            'psq',
            'psr',
            'pss',
            'pst',
            'psu',
            'psw',
            'psy',
            'pta',
            'pth',
            'pti',
            'ptn',
            'pto',
            'ptp',
            'ptq',
            'ptr',
            'ptt',
            'ptu',
            'ptv',
            'ptw',
            'pty',
            'pua',
            'pub',
            'puc',
            'pud',
            'pue',
            'puf',
            'pug',
            'pui',
            'puj',
            'pum',
            'puo',
            'pup',
            'puq',
            'pur',
            'put',
            'puu',
            'puw',
            'pux',
            'puy',
            'pwa',
            'pwb',
            'pwg',
            'pwi',
            'pwm',
            'pwn',
            'pwo',
            'pwr',
            'pww',
            'pxm',
            'pye',
            'pym',
            'pyn',
            'pys',
            'pyu',
            'pyx',
            'pyy',
            'pzn',
            'qaa..qtz',
            'qua',
            'qub',
            'quc',
            'qud',
            'quf',
            'qug',
            'quh',
            'qui',
            'quk',
            'qul',
            'qum',
            'qun',
            'qup',
            'quq',
            'qur',
            'qus',
            'quv',
            'quw',
            'qux',
            'quy',
            'quz',
            'qva',
            'qvc',
            'qve',
            'qvh',
            'qvi',
            'qvj',
            'qvl',
            'qvm',
            'qvn',
            'qvo',
            'qvp',
            'qvs',
            'qvw',
            'qvy',
            'qvz',
            'qwa',
            'qwc',
            'qwe',
            'qwh',
            'qwm',
            'qws',
            'qwt',
            'qxa',
            'qxc',
            'qxh',
            'qxl',
            'qxn',
            'qxo',
            'qxp',
            'qxq',
            'qxr',
            'qxs',
            'qxt',
            'qxu',
            'qxw',
            'qya',
            'qyp',
            'raa',
            'rab',
            'rac',
            'rad',
            'raf',
            'rag',
            'rah',
            'rai',
            'raj',
            'rak',
            'ral',
            'ram',
            'ran',
            'rao',
            'rap',
            'raq',
            'rar',
            'ras',
            'rat',
            'rau',
            'rav',
            'raw',
            'rax',
            'ray',
            'raz',
            'rbb',
            'rbk',
            'rbl',
            'rbp',
            'rcf',
            'rdb',
            'rea',
            'reb',
            'ree',
            'reg',
            'rei',
            'rej',
            'rel',
            'rem',
            'ren',
            'rer',
            'res',
            'ret',
            'rey',
            'rga',
            'rge',
            'rgk',
            'rgn',
            'rgr',
            'rgs',
            'rgu',
            'rhg',
            'rhp',
            'ria',
            'rif',
            'ril',
            'rim',
            'rin',
            'rir',
            'rit',
            'riu',
            'rjg',
            'rji',
            'rjs',
            'rka',
            'rkb',
            'rkh',
            'rki',
            'rkm',
            'rkt',
            'rkw',
            'rma',
            'rmb',
            'rmc',
            'rmd',
            'rme',
            'rmf',
            'rmg',
            'rmh',
            'rmi',
            'rmk',
            'rml',
            'rmm',
            'rmn',
            'rmo',
            'rmp',
            'rmq',
            'rms',
            'rmt',
            'rmu',
            'rmv',
            'rmw',
            'rmx',
            'rmy',
            'rmz',
            'rnd',
            'rng',
            'rnl',
            'rnn',
            'rnp',
            'rnr',
            'rnw',
            'roa',
            'rob',
            'roc',
            'rod',
            'roe',
            'rof',
            'rog',
            'rol',
            'rom',
            'roo',
            'rop',
            'ror',
            'rou',
            'row',
            'rpn',
            'rpt',
            'rri',
            'rro',
            'rrt',
            'rsb',
            'rsl',
            'rsm',
            'rtc',
            'rth',
            'rtm',
            'rts',
            'rtw',
            'rub',
            'ruc',
            'rue',
            'ruf',
            'rug',
            'ruh',
            'rui',
            'ruk',
            'ruo',
            'rup',
            'ruq',
            'rut',
            'ruu',
            'ruy',
            'ruz',
            'rwa',
            'rwk',
            'rwm',
            'rwo',
            'rwr',
            'rxd',
            'rxw',
            'ryn',
            'rys',
            'ryu',
            'rzh',
            'saa',
            'sab',
            'sac',
            'sad',
            'sae',
            'saf',
            'sah',
            'sai',
            'saj',
            'sak',
            'sal',
            'sam',
            'sao',
            'saq',
            'sar',
            'sas',
            'sat',
            'sau',
            'sav',
            'saw',
            'sax',
            'say',
            'saz',
            'sba',
            'sbb',
            'sbc',
            'sbd',
            'sbe',
            'sbf',
            'sbg',
            'sbh',
            'sbi',
            'sbj',
            'sbk',
            'sbl',
            'sbm',
            'sbn',
            'sbo',
            'sbp',
            'sbq',
            'sbr',
            'sbs',
            'sbt',
            'sbu',
            'sbv',
            'sbw',
            'sbx',
            'sby',
            'sbz',
            'scb',
            'sce',
            'scf',
            'scg',
            'sch',
            'sci',
            'sck',
            'scl',
            'scn',
            'sco',
            'scp',
            'scq',
            'scs',
            'sct',
            'scu',
            'scv',
            'scw',
            'scx',
            'sda',
            'sdb',
            'sdc',
            'sde',
            'sdf',
            'sdg',
            'sdh',
            'sdj',
            'sdk',
            'sdl',
            'sdm',
            'sdn',
            'sdo',
            'sdp',
            'sdr',
            'sds',
            'sdt',
            'sdu',
            'sdv',
            'sdx',
            'sdz',
            'sea',
            'seb',
            'sec',
            'sed',
            'see',
            'sef',
            'seg',
            'seh',
            'sei',
            'sej',
            'sek',
            'sel',
            'sem',
            'sen',
            'seo',
            'sep',
            'seq',
            'ser',
            'ses',
            'set',
            'seu',
            'sev',
            'sew',
            'sey',
            'sez',
            'sfb',
            'sfe',
            'sfm',
            'sfs',
            'sfw',
            'sga',
            'sgb',
            'sgc',
            'sgd',
            'sge',
            'sgg',
            'sgh',
            'sgi',
            'sgj',
            'sgk',
            'sgm',
            'sgn',
            'sgp',
            'sgr',
            'sgs',
            'sgt',
            'sgu',
            'sgw',
            'sgx',
            'sgy',
            'sgz',
            'sha',
            'shb',
            'shc',
            'shd',
            'she',
            'shg',
            'shh',
            'shi',
            'shj',
            'shk',
            'shl',
            'shm',
            'shn',
            'sho',
            'shp',
            'shq',
            'shr',
            'shs',
            'sht',
            'shu',
            'shv',
            'shw',
            'shx',
            'shy',
            'shz',
            'sia',
            'sib',
            'sid',
            'sie',
            'sif',
            'sig',
            'sih',
            'sii',
            'sij',
            'sik',
            'sil',
            'sim',
            'sio',
            'sip',
            'siq',
            'sir',
            'sis',
            'sit',
            'siu',
            'siv',
            'siw',
            'six',
            'siy',
            'siz',
            'sja',
            'sjb',
            'sjd',
            'sje',
            'sjg',
            'sjk',
            'sjl',
            'sjm',
            'sjn',
            'sjo',
            'sjp',
            'sjr',
            'sjs',
            'sjt',
            'sju',
            'sjw',
            'ska',
            'skb',
            'skc',
            'skd',
            'ske',
            'skf',
            'skg',
            'skh',
            'ski',
            'skj',
            'skm',
            'skn',
            'sko',
            'skp',
            'skq',
            'skr',
            'sks',
            'skt',
            'sku',
            'skv',
            'skw',
            'skx',
            'sky',
            'skz',
            'sla',
            'slc',
            'sld',
            'sle',
            'slf',
            'slg',
            'slh',
            'sli',
            'slj',
            'sll',
            'slm',
            'sln',
            'slp',
            'slq',
            'slr',
            'sls',
            'slt',
            'slu',
            'slw',
            'slx',
            'sly',
            'slz',
            'sma',
            'smb',
            'smc',
            'smd',
            'smf',
            'smg',
            'smh',
            'smi',
            'smj',
            'smk',
            'sml',
            'smm',
            'smn',
            'smp',
            'smq',
            'smr',
            'sms',
            'smt',
            'smu',
            'smv',
            'smw',
            'smx',
            'smy',
            'smz',
            'snb',
            'snc',
            'sne',
            'snf',
            'sng',
            'sni',
            'snj',
            'snk',
            'snl',
            'snm',
            'snn',
            'sno',
            'snp',
            'snq',
            'snr',
            'sns',
            'snu',
            'snv',
            'snw',
            'snx',
            'sny',
            'snz',
            'soa',
            'sob',
            'soc',
            'sod',
            'soe',
            'sog',
            'soh',
            'soi',
            'soj',
            'sok',
            'sol',
            'son',
            'soo',
            'sop',
            'soq',
            'sor',
            'sos',
            'sou',
            'sov',
            'sow',
            'sox',
            'soy',
            'soz',
            'spb',
            'spc',
            'spd',
            'spe',
            'spg',
            'spi',
            'spk',
            'spl',
            'spm',
            'spn',
            'spo',
            'spp',
            'spq',
            'spr',
            'sps',
            'spt',
            'spu',
            'spv',
            'spx',
            'spy',
            'sqa',
            'sqh',
            'sqj',
            'sqk',
            'sqm',
            'sqn',
            'sqo',
            'sqq',
            'sqr',
            'sqs',
            'sqt',
            'squ',
            'sra',
            'srb',
            'src',
            'sre',
            'srf',
            'srg',
            'srh',
            'sri',
            'srk',
            'srl',
            'srm',
            'srn',
            'sro',
            'srq',
            'srr',
            'srs',
            'srt',
            'sru',
            'srv',
            'srw',
            'srx',
            'sry',
            'srz',
            'ssa',
            'ssb',
            'ssc',
            'ssd',
            'sse',
            'ssf',
            'ssg',
            'ssh',
            'ssi',
            'ssj',
            'ssk',
            'ssl',
            'ssm',
            'ssn',
            'sso',
            'ssp',
            'ssq',
            'ssr',
            'sss',
            'sst',
            'ssu',
            'ssv',
            'ssx',
            'ssy',
            'ssz',
            'sta',
            'stb',
            'std',
            'ste',
            'stf',
            'stg',
            'sth',
            'sti',
            'stj',
            'stk',
            'stl',
            'stm',
            'stn',
            'sto',
            'stp',
            'stq',
            'str',
            'sts',
            'stt',
            'stu',
            'stv',
            'stw',
            'sty',
            'sua',
            'sub',
            'suc',
            'sue',
            'sug',
            'sui',
            'suj',
            'suk',
            'suq',
            'sur',
            'sus',
            'sut',
            'suv',
            'suw',
            'sux',
            'suy',
            'suz',
            'sva',
            'svb',
            'svc',
            'sve',
            'svk',
            'svm',
            'svs',
            'svx',
            'swb',
            'swc',
            'swf',
            'swg',
            'swh',
            'swi',
            'swj',
            'swk',
            'swl',
            'swm',
            'swn',
            'swo',
            'swp',
            'swq',
            'swr',
            'sws',
            'swt',
            'swu',
            'swv',
            'sww',
            'swx',
            'swy',
            'sxb',
            'sxc',
            'sxe',
            'sxg',
            'sxk',
            'sxl',
            'sxm',
            'sxn',
            'sxo',
            'sxr',
            'sxs',
            'sxu',
            'sxw',
            'sya',
            'syb',
            'syc',
            'syd',
            'syi',
            'syk',
            'syl',
            'sym',
            'syn',
            'syo',
            'syr',
            'sys',
            'syw',
            'syx',
            'syy',
            'sza',
            'szb',
            'szc',
            'szd',
            'sze',
            'szg',
            'szl',
            'szn',
            'szp',
            'szs',
            'szv',
            'szw',
            'taa',
            'tab',
            'tac',
            'tad',
            'tae',
            'taf',
            'tag',
            'tai',
            'taj',
            'tak',
            'tal',
            'tan',
            'tao',
            'tap',
            'taq',
            'tar',
            'tas',
            'tau',
            'tav',
            'taw',
            'tax',
            'tay',
            'taz',
            'tba',
            'tbb',
            'tbc',
            'tbd',
            'tbe',
            'tbf',
            'tbg',
            'tbh',
            'tbi',
            'tbj',
            'tbk',
            'tbl',
            'tbm',
            'tbn',
            'tbo',
            'tbp',
            'tbq',
            'tbr',
            'tbs',
            'tbt',
            'tbu',
            'tbv',
            'tbw',
            'tbx',
            'tby',
            'tbz',
            'tca',
            'tcb',
            'tcc',
            'tcd',
            'tce',
            'tcf',
            'tcg',
            'tch',
            'tci',
            'tck',
            'tcl',
            'tcm',
            'tcn',
            'tco',
            'tcp',
            'tcq',
            'tcs',
            'tct',
            'tcu',
            'tcw',
            'tcx',
            'tcy',
            'tcz',
            'tda',
            'tdb',
            'tdc',
            'tdd',
            'tde',
            'tdf',
            'tdg',
            'tdh',
            'tdi',
            'tdj',
            'tdk',
            'tdl',
            'tdm',
            'tdn',
            'tdo',
            'tdq',
            'tdr',
            'tds',
            'tdt',
            'tdv',
            'tdx',
            'tdy',
            'tea',
            'teb',
            'tec',
            'ted',
            'tee',
            'tef',
            'teg',
            'teh',
            'tei',
            'tek',
            'tem',
            'ten',
            'teo',
            'tep',
            'teq',
            'ter',
            'tes',
            'tet',
            'teu',
            'tev',
            'tew',
            'tex',
            'tey',
            'tez',
            'tfi',
            'tfn',
            'tfo',
            'tfr',
            'tft',
            'tga',
            'tgb',
            'tgc',
            'tgd',
            'tge',
            'tgf',
            'tgh',
            'tgi',
            'tgj',
            'tgn',
            'tgo',
            'tgp',
            'tgq',
            'tgr',
            'tgs',
            'tgt',
            'tgu',
            'tgv',
            'tgw',
            'tgx',
            'tgy',
            'tgz',
            'thd',
            'the',
            'thf',
            'thh',
            'thi',
            'thk',
            'thl',
            'thm',
            'thn',
            'thp',
            'thq',
            'thr',
            'ths',
            'tht',
            'thu',
            'thv',
            'thw',
            'thy',
            'thz',
            'tia',
            'tic',
            'tif',
            'tig',
            'tih',
            'tii',
            'tij',
            'tik',
            'til',
            'tim',
            'tin',
            'tio',
            'tip',
            'tiq',
            'tis',
            'tit',
            'tiu',
            'tiv',
            'tiw',
            'tix',
            'tiy',
            'tiz',
            'tja',
            'tjg',
            'tji',
            'tjl',
            'tjm',
            'tjn',
            'tjo',
            'tjs',
            'tju',
            'tjw',
            'tka',
            'tkb',
            'tkd',
            'tke',
            'tkf',
            'tkg',
            'tkl',
            'tkm',
            'tkn',
            'tkp',
            'tkq',
            'tkr',
            'tks',
            'tkt',
            'tku',
            'tkv',
            'tkw',
            'tkx',
            'tkz',
            'tla',
            'tlb',
            'tlc',
            'tld',
            'tlf',
            'tlg',
            'tlh',
            'tli',
            'tlj',
            'tlk',
            'tll',
            'tlm',
            'tln',
            'tlo',
            'tlp',
            'tlq',
            'tlr',
            'tls',
            'tlt',
            'tlu',
            'tlv',
            'tlx',
            'tly',
            'tma',
            'tmb',
            'tmc',
            'tmd',
            'tme',
            'tmf',
            'tmg',
            'tmh',
            'tmi',
            'tmj',
            'tmk',
            'tml',
            'tmm',
            'tmn',
            'tmo',
            'tmq',
            'tmr',
            'tms',
            'tmt',
            'tmu',
            'tmv',
            'tmw',
            'tmy',
            'tmz',
            'tna',
            'tnb',
            'tnc',
            'tnd',
            'tng',
            'tnh',
            'tni',
            'tnk',
            'tnl',
            'tnm',
            'tnn',
            'tno',
            'tnp',
            'tnq',
            'tnr',
            'tns',
            'tnt',
            'tnu',
            'tnv',
            'tnw',
            'tnx',
            'tny',
            'tnz',
            'tob',
            'toc',
            'tod',
            'tof',
            'tog',
            'toh',
            'toi',
            'toj',
            'tol',
            'tom',
            'too',
            'top',
            'toq',
            'tor',
            'tos',
            'tou',
            'tov',
            'tow',
            'tox',
            'toy',
            'toz',
            'tpa',
            'tpc',
            'tpe',
            'tpf',
            'tpg',
            'tpi',
            'tpj',
            'tpk',
            'tpl',
            'tpm',
            'tpn',
            'tpo',
            'tpp',
            'tpq',
            'tpr',
            'tpt',
            'tpu',
            'tpv',
            'tpw',
            'tpx',
            'tpy',
            'tpz',
            'tqb',
            'tql',
            'tqm',
            'tqn',
            'tqo',
            'tqp',
            'tqq',
            'tqr',
            'tqt',
            'tqu',
            'tqw',
            'tra',
            'trb',
            'trc',
            'trd',
            'tre',
            'trf',
            'trg',
            'trh',
            'tri',
            'trj',
            'trk',
            'trl',
            'trm',
            'trn',
            'tro',
            'trp',
            'trq',
            'trr',
            'trs',
            'trt',
            'tru',
            'trv',
            'trw',
            'trx',
            'try',
            'trz',
            'tsa',
            'tsb',
            'tsc',
            'tsd',
            'tse',
            'tsg',
            'tsh',
            'tsi',
            'tsj',
            'tsk',
            'tsl',
            'tsm',
            'tsp',
            'tsq',
            'tsr',
            'tss',
            'tst',
            'tsu',
            'tsv',
            'tsw',
            'tsx',
            'tsy',
            'tsz',
            'tta',
            'ttb',
            'ttc',
            'ttd',
            'tte',
            'ttf',
            'ttg',
            'tth',
            'tti',
            'ttj',
            'ttk',
            'ttl',
            'ttm',
            'ttn',
            'tto',
            'ttp',
            'ttq',
            'ttr',
            'tts',
            'ttt',
            'ttu',
            'ttv',
            'ttw',
            'tty',
            'ttz',
            'tua',
            'tub',
            'tuc',
            'tud',
            'tue',
            'tuf',
            'tug',
            'tuh',
            'tui',
            'tuj',
            'tul',
            'tum',
            'tun',
            'tuo',
            'tup',
            'tuq',
            'tus',
            'tut',
            'tuu',
            'tuv',
            'tuw',
            'tux',
            'tuy',
            'tuz',
            'tva',
            'tvd',
            'tve',
            'tvk',
            'tvl',
            'tvm',
            'tvn',
            'tvo',
            'tvs',
            'tvt',
            'tvu',
            'tvw',
            'tvy',
            'twa',
            'twb',
            'twc',
            'twd',
            'twe',
            'twf',
            'twg',
            'twh',
            'twl',
            'twm',
            'twn',
            'two',
            'twp',
            'twq',
            'twr',
            'twt',
            'twu',
            'tww',
            'twx',
            'twy',
            'txa',
            'txb',
            'txc',
            'txe',
            'txg',
            'txh',
            'txi',
            'txj',
            'txm',
            'txn',
            'txo',
            'txq',
            'txr',
            'txs',
            'txt',
            'txu',
            'txx',
            'txy',
            'tya',
            'tye',
            'tyh',
            'tyi',
            'tyj',
            'tyl',
            'tyn',
            'typ',
            'tyr',
            'tys',
            'tyt',
            'tyu',
            'tyv',
            'tyx',
            'tyz',
            'tza',
            'tzh',
            'tzj',
            'tzl',
            'tzm',
            'tzn',
            'tzo',
            'tzx',
            'uam',
            'uan',
            'uar',
            'uba',
            'ubi',
            'ubl',
            'ubr',
            'ubu',
            'uby',
            'uda',
            'ude',
            'udg',
            'udi',
            'udj',
            'udl',
            'udm',
            'udu',
            'ues',
            'ufi',
            'uga',
            'ugb',
            'uge',
            'ugn',
            'ugo',
            'ugy',
            'uha',
            'uhn',
            'uis',
            'uiv',
            'uji',
            'uka',
            'ukg',
            'ukh',
            'ukk',
            'ukl',
            'ukp',
            'ukq',
            'uks',
            'uku',
            'ukw',
            'uky',
            'ula',
            'ulb',
            'ulc',
            'ule',
            'ulf',
            'uli',
            'ulk',
            'ull',
            'ulm',
            'uln',
            'ulu',
            'ulw',
            'uma',
            'umb',
            'umc',
            'umd',
            'umg',
            'umi',
            'umm',
            'umn',
            'umo',
            'ump',
            'umr',
            'ums',
            'umu',
            'una',
            'und',
            'une',
            'ung',
            'unk',
            'unm',
            'unn',
            'unr',
            'unu',
            'unx',
            'unz',
            'upi',
            'upv',
            'ura',
            'urb',
            'urc',
            'ure',
            'urf',
            'urg',
            'urh',
            'uri',
            'urj',
            'urk',
            'url',
            'urm',
            'urn',
            'uro',
            'urp',
            'urr',
            'urt',
            'uru',
            'urv',
            'urw',
            'urx',
            'ury',
            'urz',
            'usa',
            'ush',
            'usi',
            'usk',
            'usp',
            'usu',
            'uta',
            'ute',
            'utp',
            'utr',
            'utu',
            'uum',
            'uun',
            'uur',
            'uuu',
            'uve',
            'uvh',
            'uvl',
            'uwa',
            'uya',
            'uzn',
            'uzs',
            'vaa',
            'vae',
            'vaf',
            'vag',
            'vah',
            'vai',
            'vaj',
            'val',
            'vam',
            'van',
            'vao',
            'vap',
            'var',
            'vas',
            'vau',
            'vav',
            'vay',
            'vbb',
            'vbk',
            'vec',
            'ved',
            'vel',
            'vem',
            'veo',
            'vep',
            'ver',
            'vgr',
            'vgt',
            'vic',
            'vid',
            'vif',
            'vig',
            'vil',
            'vin',
            'vis',
            'vit',
            'viv',
            'vka',
            'vki',
            'vkj',
            'vkk',
            'vkl',
            'vkm',
            'vko',
            'vkp',
            'vkt',
            'vku',
            'vlp',
            'vls',
            'vma',
            'vmb',
            'vmc',
            'vmd',
            'vme',
            'vmf',
            'vmg',
            'vmh',
            'vmi',
            'vmj',
            'vmk',
            'vml',
            'vmm',
            'vmp',
            'vmq',
            'vmr',
            'vms',
            'vmu',
            'vmv',
            'vmw',
            'vmx',
            'vmy',
            'vmz',
            'vnk',
            'vnm',
            'vnp',
            'vor',
            'vot',
            'vra',
            'vro',
            'vrs',
            'vrt',
            'vsi',
            'vsl',
            'vsv',
            'vto',
            'vum',
            'vun',
            'vut',
            'vwa',
            'waa',
            'wab',
            'wac',
            'wad',
            'wae',
            'waf',
            'wag',
            'wah',
            'wai',
            'waj',
            'wak',
            'wal',
            'wam',
            'wan',
            'wao',
            'wap',
            'waq',
            'war',
            'was',
            'wat',
            'wau',
            'wav',
            'waw',
            'wax',
            'way',
            'waz',
            'wba',
            'wbb',
            'wbe',
            'wbf',
            'wbh',
            'wbi',
            'wbj',
            'wbk',
            'wbl',
            'wbm',
            'wbp',
            'wbq',
            'wbr',
            'wbs',
            'wbt',
            'wbv',
            'wbw',
            'wca',
            'wci',
            'wdd',
            'wdg',
            'wdj',
            'wdk',
            'wdu',
            'wdy',
            'wea',
            'wec',
            'wed',
            'weg',
            'weh',
            'wei',
            'wem',
            'wen',
            'weo',
            'wep',
            'wer',
            'wes',
            'wet',
            'weu',
            'wew',
            'wfg',
            'wga',
            'wgb',
            'wgg',
            'wgi',
            'wgo',
            'wgu',
            'wgy',
            'wha',
            'whg',
            'whk',
            'whu',
            'wib',
            'wic',
            'wie',
            'wif',
            'wig',
            'wih',
            'wii',
            'wij',
            'wik',
            'wil',
            'wim',
            'win',
            'wir',
            'wiu',
            'wiv',
            'wiy',
            'wja',
            'wji',
            'wka',
            'wkb',
            'wkd',
            'wkl',
            'wku',
            'wkw',
            'wky',
            'wla',
            'wlc',
            'wle',
            'wlg',
            'wli',
            'wlk',
            'wll',
            'wlm',
            'wlo',
            'wlr',
            'wls',
            'wlu',
            'wlv',
            'wlw',
            'wlx',
            'wly',
            'wma',
            'wmb',
            'wmc',
            'wmd',
            'wme',
            'wmh',
            'wmi',
            'wmm',
            'wmn',
            'wmo',
            'wms',
            'wmt',
            'wmw',
            'wmx',
            'wnb',
            'wnc',
            'wnd',
            'wne',
            'wng',
            'wni',
            'wnk',
            'wnm',
            'wnn',
            'wno',
            'wnp',
            'wnu',
            'wnw',
            'wny',
            'woa',
            'wob',
            'woc',
            'wod',
            'woe',
            'wof',
            'wog',
            'woi',
            'wok',
            'wom',
            'won',
            'woo',
            'wor',
            'wos',
            'wow',
            'woy',
            'wpc',
            'wra',
            'wrb',
            'wrd',
            'wrg',
            'wrh',
            'wri',
            'wrk',
            'wrl',
            'wrm',
            'wrn',
            'wro',
            'wrp',
            'wrr',
            'wrs',
            'wru',
            'wrv',
            'wrw',
            'wrx',
            'wry',
            'wrz',
            'wsa',
            'wsg',
            'wsi',
            'wsk',
            'wsr',
            'wss',
            'wsu',
            'wsv',
            'wtf',
            'wth',
            'wti',
            'wtk',
            'wtm',
            'wtw',
            'wua',
            'wub',
            'wud',
            'wuh',
            'wul',
            'wum',
            'wun',
            'wur',
            'wut',
            'wuu',
            'wuv',
            'wux',
            'wuy',
            'wwa',
            'wwb',
            'wwo',
            'wwr',
            'www',
            'wxa',
            'wxw',
            'wya',
            'wyb',
            'wyi',
            'wym',
            'wyr',
            'wyy',
            'xaa',
            'xab',
            'xac',
            'xad',
            'xae',
            'xag',
            'xai',
            'xaj',
            'xak',
            'xal',
            'xam',
            'xan',
            'xao',
            'xap',
            'xaq',
            'xar',
            'xas',
            'xat',
            'xau',
            'xav',
            'xaw',
            'xay',
            'xbb',
            'xbc',
            'xbd',
            'xbe',
            'xbg',
            'xbi',
            'xbj',
            'xbm',
            'xbn',
            'xbo',
            'xbp',
            'xbr',
            'xbw',
            'xby',
            'xcb',
            'xcc',
            'xce',
            'xcg',
            'xch',
            'xcl',
            'xcm',
            'xcn',
            'xco',
            'xcr',
            'xct',
            'xcu',
            'xcv',
            'xcw',
            'xcy',
            'xda',
            'xdc',
            'xdk',
            'xdm',
            'xdo',
            'xdy',
            'xeb',
            'xed',
            'xeg',
            'xel',
            'xem',
            'xep',
            'xer',
            'xes',
            'xet',
            'xeu',
            'xfa',
            'xga',
            'xgb',
            'xgd',
            'xgf',
            'xgg',
            'xgi',
            'xgl',
            'xgm',
            'xgn',
            'xgr',
            'xgu',
            'xgw',
            'xha',
            'xhc',
            'xhd',
            'xhe',
            'xhr',
            'xht',
            'xhu',
            'xhv',
            'xib',
            'xii',
            'xil',
            'xin',
            'xir',
            'xis',
            'xiv',
            'xiy',
            'xjb',
            'xjt',
            'xka',
            'xkb',
            'xkc',
            'xkd',
            'xke',
            'xkf',
            'xkg',
            'xki',
            'xkj',
            'xkk',
            'xkl',
            'xkn',
            'xko',
            'xkp',
            'xkq',
            'xkr',
            'xks',
            'xkt',
            'xku',
            'xkv',
            'xkw',
            'xkx',
            'xky',
            'xkz',
            'xla',
            'xlb',
            'xlc',
            'xld',
            'xle',
            'xlg',
            'xli',
            'xln',
            'xlo',
            'xlp',
            'xls',
            'xlu',
            'xly',
            'xma',
            'xmb',
            'xmc',
            'xmd',
            'xme',
            'xmf',
            'xmg',
            'xmh',
            'xmj',
            'xmk',
            'xml',
            'xmm',
            'xmn',
            'xmo',
            'xmp',
            'xmq',
            'xmr',
            'xms',
            'xmt',
            'xmu',
            'xmv',
            'xmw',
            'xmx',
            'xmy',
            'xmz',
            'xna',
            'xnb',
            'xnd',
            'xng',
            'xnh',
            'xni',
            'xnk',
            'xnn',
            'xno',
            'xnr',
            'xns',
            'xnt',
            'xnu',
            'xny',
            'xnz',
            'xoc',
            'xod',
            'xog',
            'xoi',
            'xok',
            'xom',
            'xon',
            'xoo',
            'xop',
            'xor',
            'xow',
            'xpa',
            'xpc',
            'xpe',
            'xpg',
            'xpi',
            'xpj',
            'xpk',
            'xpm',
            'xpn',
            'xpo',
            'xpp',
            'xpq',
            'xpr',
            'xps',
            'xpt',
            'xpu',
            'xpy',
            'xqa',
            'xqt',
            'xra',
            'xrb',
            'xrd',
            'xre',
            'xrg',
            'xri',
            'xrm',
            'xrn',
            'xrq',
            'xrr',
            'xrt',
            'xru',
            'xrw',
            'xsa',
            'xsb',
            'xsc',
            'xsd',
            'xse',
            'xsh',
            'xsi',
            'xsl',
            'xsm',
            'xsn',
            'xso',
            'xsp',
            'xsq',
            'xsr',
            'xss',
            'xsu',
            'xsv',
            'xsy',
            'xta',
            'xtb',
            'xtc',
            'xtd',
            'xte',
            'xtg',
            'xth',
            'xti',
            'xtj',
            'xtl',
            'xtm',
            'xtn',
            'xto',
            'xtp',
            'xtq',
            'xtr',
            'xts',
            'xtt',
            'xtu',
            'xtv',
            'xtw',
            'xty',
            'xtz',
            'xua',
            'xub',
            'xud',
            'xug',
            'xuj',
            'xul',
            'xum',
            'xun',
            'xuo',
            'xup',
            'xur',
            'xut',
            'xuu',
            'xve',
            'xvi',
            'xvn',
            'xvo',
            'xvs',
            'xwa',
            'xwc',
            'xwd',
            'xwe',
            'xwg',
            'xwj',
            'xwk',
            'xwl',
            'xwo',
            'xwr',
            'xwt',
            'xww',
            'xxb',
            'xxk',
            'xxm',
            'xxr',
            'xxt',
            'xya',
            'xyb',
            'xyj',
            'xyk',
            'xyl',
            'xyt',
            'xyy',
            'xzh',
            'xzm',
            'xzp',
            'yaa',
            'yab',
            'yac',
            'yad',
            'yae',
            'yaf',
            'yag',
            'yah',
            'yai',
            'yaj',
            'yak',
            'yal',
            'yam',
            'yan',
            'yao',
            'yap',
            'yaq',
            'yar',
            'yas',
            'yat',
            'yau',
            'yav',
            'yaw',
            'yax',
            'yay',
            'yaz',
            'yba',
            'ybb',
            'ybe',
            'ybh',
            'ybi',
            'ybj',
            'ybk',
            'ybl',
            'ybm',
            'ybn',
            'ybo',
            'ybx',
            'yby',
            'ych',
            'ycl',
            'ycn',
            'ycp',
            'yda',
            'ydd',
            'yde',
            'ydg',
            'ydk',
            'yea',
            'yec',
            'yee',
            'yei',
            'yej',
            'yel',
            'yer',
            'yes',
            'yet',
            'yeu',
            'yev',
            'yey',
            'yga',
            'ygi',
            'ygl',
            'ygm',
            'ygp',
            'ygr',
            'ygs',
            'ygu',
            'ygw',
            'yha',
            'yhd',
            'yhl',
            'yhs',
            'yia',
            'yif',
            'yig',
            'yih',
            'yii',
            'yij',
            'yik',
            'yil',
            'yim',
            'yin',
            'yip',
            'yiq',
            'yir',
            'yis',
            'yit',
            'yiu',
            'yiv',
            'yix',
            'yiz',
            'yka',
            'ykg',
            'yki',
            'ykk',
            'ykl',
            'ykm',
            'ykn',
            'yko',
            'ykr',
            'ykt',
            'yku',
            'yky',
            'yla',
            'ylb',
            'yle',
            'ylg',
            'yli',
            'yll',
            'ylm',
            'yln',
            'ylo',
            'ylr',
            'ylu',
            'yly',
            'ymb',
            'ymc',
            'ymd',
            'yme',
            'ymg',
            'ymh',
            'ymi',
            'ymk',
            'yml',
            'ymm',
            'ymn',
            'ymo',
            'ymp',
            'ymq',
            'ymr',
            'yms',
            'ymx',
            'ymz',
            'yna',
            'ynd',
            'yne',
            'yng',
            'ynk',
            'ynl',
            'ynn',
            'yno',
            'ynq',
            'yns',
            'ynu',
            'yob',
            'yog',
            'yoi',
            'yok',
            'yol',
            'yom',
            'yon',
            'yot',
            'yox',
            'yoy',
            'ypa',
            'ypb',
            'ypg',
            'yph',
            'ypk',
            'ypm',
            'ypn',
            'ypo',
            'ypp',
            'ypz',
            'yra',
            'yrb',
            'yre',
            'yrk',
            'yrl',
            'yrm',
            'yrn',
            'yro',
            'yrs',
            'yrw',
            'yry',
            'ysc',
            'ysd',
            'ysg',
            'ysl',
            'ysn',
            'yso',
            'ysp',
            'ysr',
            'yss',
            'ysy',
            'yta',
            'ytl',
            'ytp',
            'ytw',
            'yty',
            'yua',
            'yub',
            'yuc',
            'yud',
            'yue',
            'yuf',
            'yug',
            'yui',
            'yuj',
            'yuk',
            'yul',
            'yum',
            'yun',
            'yup',
            'yuq',
            'yur',
            'yut',
            'yuw',
            'yux',
            'yuy',
            'yuz',
            'yva',
            'yvt',
            'ywa',
            'ywg',
            'ywl',
            'ywn',
            'ywq',
            'ywr',
            'ywt',
            'ywu',
            'yww',
            'yxa',
            'yxg',
            'yxl',
            'yxm',
            'yxu',
            'yxy',
            'yyr',
            'yyu',
            'yyz',
            'yzg',
            'yzk',
            'zaa',
            'zab',
            'zac',
            'zad',
            'zae',
            'zaf',
            'zag',
            'zah',
            'zai',
            'zaj',
            'zak',
            'zal',
            'zam',
            'zao',
            'zap',
            'zaq',
            'zar',
            'zas',
            'zat',
            'zau',
            'zav',
            'zaw',
            'zax',
            'zay',
            'zaz',
            'zbc',
            'zbe',
            'zbl',
            'zbt',
            'zbw',
            'zca',
            'zch',
            'zdj',
            'zea',
            'zeg',
            'zeh',
            'zen',
            'zga',
            'zgb',
            'zgh',
            'zgm',
            'zgn',
            'zgr',
            'zhb',
            'zhd',
            'zhi',
            'zhn',
            'zhw',
            'zhx',
            'zia',
            'zib',
            'zik',
            'zil',
            'zim',
            'zin',
            'zir',
            'ziw',
            'ziz',
            'zka',
            'zkb',
            'zkd',
            'zkg',
            'zkh',
            'zkk',
            'zkn',
            'zko',
            'zkp',
            'zkr',
            'zkt',
            'zku',
            'zkv',
            'zkz',
            'zle',
            'zlj',
            'zlm',
            'zln',
            'zlq',
            'zls',
            'zlw',
            'zma',
            'zmb',
            'zmc',
            'zmd',
            'zme',
            'zmf',
            'zmg',
            'zmh',
            'zmi',
            'zmj',
            'zmk',
            'zml',
            'zmm',
            'zmn',
            'zmo',
            'zmp',
            'zmq',
            'zmr',
            'zms',
            'zmt',
            'zmu',
            'zmv',
            'zmw',
            'zmx',
            'zmy',
            'zmz',
            'zna',
            'znd',
            'zne',
            'zng',
            'znk',
            'zns',
            'zoc',
            'zoh',
            'zom',
            'zoo',
            'zoq',
            'zor',
            'zos',
            'zpa',
            'zpb',
            'zpc',
            'zpd',
            'zpe',
            'zpf',
            'zpg',
            'zph',
            'zpi',
            'zpj',
            'zpk',
            'zpl',
            'zpm',
            'zpn',
            'zpo',
            'zpp',
            'zpq',
            'zpr',
            'zps',
            'zpt',
            'zpu',
            'zpv',
            'zpw',
            'zpx',
            'zpy',
            'zpz',
            'zqe',
            'zra',
            'zrg',
            'zrn',
            'zro',
            'zrp',
            'zrs',
            'zsa',
            'zsk',
            'zsl',
            'zsm',
            'zsr',
            'zsu',
            'zte',
            'ztg',
            'ztl',
            'ztm',
            'ztn',
            'ztp',
            'ztq',
            'zts',
            'ztt',
            'ztu',
            'ztx',
            'zty',
            'zua',
            'zuh',
            'zum',
            'zun',
            'zuy',
            'zwa',
            'zyb',
            'zyg',
            'zyj',
            'zyn',
            'zyp',
            'zza',
            'zzj',
        ];
        for (let i = 0; i < ary.length; i++) {
            (languages)[ary[i]] = 'yes';
        }
    }
    if (EcObject.isObject(o)) {
        const keys = EcObject.keys(o);
        let langStringArray = [];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key == '@value') {
                return (o)[key];
            }
            if (langStringArray != null) {
                if ((languages)[key.toLowerCase()] == 'yes') {
                    langStringArray.push((o)[key]);
                } else {
                    langStringArray = null;
                }
            }
            (o)[key] = flattenLangstrings((o)[key]);
        }
        if (langStringArray != null && langStringArray.length > 0) {
            return langStringArray;
        }
    } else if (EcArray.isArray(o)) {
        const a = o;
        for (let i = 0; i < a.length; i++) {
            a[i] = flattenLangstrings(a[i]);
        }
    }
    return o;
};
const getIndexForObject = function (o, type) {
    return inferTypeFromObj(o, type).toLowerCase();
};
const getTypeForObject = function (o, type) {
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        return '_doc';
    } else {
        return inferTypeFromObj(o, type);
    }
};
const removeNonIndexables = function (o) {
    if (o != null && EcObject.isObject(o)) {
        const keys = EcObject.keys(o);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            removeNonIndexables((o)[key]);
        }
        if (o.type == 'EncryptedValue' || o['@type'] == 'EncryptedValue') {
            delete (o)['payload'];
            delete (o)['secret'];
        }
        delete (o)['signature'];
        delete (o)['@signature'];
    } else if (o != null && EcArray.isArray(o)) {
        const a = o;
        for (let i = 0; i < a.length; i++) {
            removeNonIndexables(a[i]);
        }
    }
};
const skyrepoPutInternalIndex = async function (o, id, version, type) {
    const url = putUrl.call(this, o, id, version, type);
    o = flattenLangstrings(JSON.parse(JSON.stringify(o)));
    removeNonIndexables(o);
    if ((o)['owner'] != null && EcArray.isArray((o)['owner'])) {
        let owners = (o)['owner'];
        for (let i = 0; i < owners.length; i++) {
            if (owners[i].indexOf('\n') != -1) {
                owners[i] = EcPk.fromPem(owners[i]).toPem();
            }
        }
    }
    if ((o)['reader'] != null && EcArray.isArray((o)['reader'])) {
        let owners = (o)['reader'];
        for (let i = 0; i < owners.length; i++) {
            if (owners[i].indexOf('\n') != -1) {
                owners[i] = EcPk.fromPem(owners[i]).toPem();
            }
        }
    }
    try {
        (o)['@version'] = parseInt(version);
        if (isNaN((o)['@version'])) {
            (o)['@version'] = new Date().getTime();
        }
    } catch (ex) {
        (o)['@version'] = new Date().getTime();
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoPutInternalIndex', JSON.stringify(o));
    }
    const response = await httpPost(o, url, 'application/json', false, null, null, true, elasticHeaders());
    return response;
};
let permanentCreated = false;
const skyrepoPutInternalPermanent = async function (o, id, version, type) {
    if (permanentCreated != true) {
        const mappings = {};
        const permNoIndex = {};
        const doc = {};
        (mappings)['mappings'] = permNoIndex;

        if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
            permNoIndex.enabled = false;
        } else {
            (permNoIndex)['permanent'] = doc;
        }
        (doc)['enabled'] = false;
        const result = await httpPut(mappings, elasticEndpoint + '/permanent', 'application/json', elasticHeaders());
        if (global.skyrepoDebug) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoPutInternalPerm', JSON.stringify(result));
        }
        permanentCreated = true;
    }
    const data = {};
    (data)['data'] = JSON.stringify(o);
    data.writeMs = new Date().getTime();
    let url = putPermanentBaseUrl.call(this, o, id, version, type);
    let results = await httpPost(data, url, 'application/json', false, null, null, true, elasticHeaders());
    if (results === 409) {
        return JSON.stringify(results);
    }
    if (version != null) {
        url = putPermanentUrl.call(this, o, id, version, type);
        results = await httpPost(data, url, 'application/json', false, null, null, true, elasticHeaders());
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoPutInternalPerm', JSON.stringify(results));
    }
    return JSON.stringify(results);
};
let skyrepoPutInternalPermanentBulk = global.skyrepoPutInternalPermanentBulk = async function (map) {
    const failed = {};

    let body = '';

    for (let x of Object.values(map)) {
        let writeMs = new Date().getTime();

        for (let id of x.permanentIds) {
            let obj = { 'index': { '_index': 'permanent', '_id': id + '.' + (x.version || ''), '_type': getTypeForObject(x.object, x.type), 'version': x.version, 'version_type': 'external' } };
            if (elasticSearchVersion().startsWith('8.')) {
                delete obj.index['_type'];
            }
            body += `${JSON.stringify(obj)}\n`;
            body += `${JSON.stringify({ data: JSON.stringify(x.object), writeMs: writeMs })}\n`;

            obj = { 'index': { '_index': 'permanent', '_id': id + '.', '_type': getTypeForObject(x.object, x.type), 'version': x.version, 'version_type': 'external' } };
            if (elasticSearchVersion().startsWith('8.')) {
                delete obj.index['_type'];
            }
            body += `${JSON.stringify(obj)}\n`;
            body += `${JSON.stringify({ data: JSON.stringify(x.object), writeMs: writeMs })}\n`;
        }
    }
    const response = await httpPost(body, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
    if (!response) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'PutPermBulk', 'No response');
        for (let x of Object.values(map)) {
            failed[x.id] = true;
        }
        return failed;
    }

    if (response.errors) {
        let retries = {};

        for (let item of response.items) {
            if (item.index.status === 409) {
                let found = Object.values(map).find((x) => x.permanentIds.includes(item.index['_id'].split('.')[0]));
                if (found) {
                    retries[found.id] = found;
                }
            } else if (item.index.error) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'PutPermBulk', item);
                let found = Object.values(map).find((x) => x.permanentIds.includes(item.index['_id'].split('.')[0]));
                if (found) {
                    failed[found.id] = true;
                    delete map[found.id];
                }
            }
        }

        if (Object.values(retries).length > 0) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepoPutInternal', '409, version is: [' + Object.values(retries).map((x) => x.version).toString() + ']');
            const current = await skyrepoManyGetPermanent.call(this, Object.values(retries));
            for (let currentDoc of current.docs) {
                let found = retries[currentDoc['_id'].split('.')[0]];
                if (currentDoc['_version'] >= found.version) {
                    found.version = currentDoc['_version'] + 1;
                }
            }

            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepoPutInternal', 'Updated to: [' + Object.values(retries).map((x) => x.version).toString() + ']');

            // Used to replay replication / database log files without "just jamming the data in"
            if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || this.ctx.sanctionedReplay != true) {
                const newFailed = await skyrepoPutInternalBulk.call(this, retries);
                for (let key of Object.keys(newFailed)) {
                    failed[key] = true;
                    delete map[key];
                }
            }
        }
    }

    return failed;
};
let skyrepoPutInternalBulk = global.skyrepoPutInternalBulk = async function (map) {
    const failed = {};
    Object.assign(failed, await skyrepoPutInternalIndexBulk.call(this, map));
    if (Object.values(map).length > 0) {
        Object.assign(failed, await skyrepoPutInternalPermanentBulk.call(this, map));
    }

    return failed;
};
let skyrepoPutInternalIndexBulk = global.skyrepoPutInternalIndexBulk = async function (map) {
    const failed = {};
    for (let x of Object.values(map)) {
        x.permanentIds = [];
        x.permanentIds.push(x.id);

        const erld = new EcRemoteLinkedData(null, null);
        erld.copyFrom(x.object);
        if (this.ctx && this.ctx.req && this.ctx.req.eim != null) {
            try {
                await this.ctx.req.eim.sign(erld);
                x.object = JSON.parse(erld.toJson());
            } catch (msg) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'SkyrepoPutInternalError', msg);
            }
        }

        if (erld.id != null && erld.getGuid() != null) {
            EcArray.setAdd(x.permanentIds, erld.getGuid());
        };
        if (erld.id != null && erld.shortId() != null) {
            EcArray.setAdd(x.permanentIds, EcCrypto.md5(erld.shortId()));
        }
    }
    const permIndexes = await skyrepoManyGetIndexInternal.call(this, 'permanent', Object.values(map));
    if (permIndexes) {
        for (let x of permIndexes.docs) {
            let id = x['_id'].split('.')[0];
            let chosenVersion = map[id].version;
            if (chosenVersion == null) {
                if (x != null && x['_version'] != null && !isNaN(x['_version'])) {
                    chosenVersion = x['_version'] + 1;
                } else {
                    chosenVersion = 1;
                }
            }

            map[id].version = chosenVersion;
        }
    } else {
        for (let key of Object.keys(map)) {
            if (map[key].version == null) {
                map[key].version = 1;
            }
        }
    }

    let body = '';

    for (let x of Object.values(map)) {
        let o = x.object;
        o = flattenLangstrings(JSON.parse(JSON.stringify(o)));
        if ((o)['owner'] != null && EcArray.isArray((o)['owner'])) {
            let owners = (o)['owner'];
            for (let i = 0; i < owners.length; i++) {
                if (owners[i].indexOf('\n') != -1) {
                    owners[i] = EcPk.fromPem(owners[i]).toPem();
                }
            }
        }
        if ((o)['reader'] != null && EcArray.isArray((o)['reader'])) {
            let owners = (o)['reader'];
            for (let i = 0; i < owners.length; i++) {
                if (owners[i].indexOf('\n') != -1) {
                    owners[i] = EcPk.fromPem(owners[i]).toPem();
                }
            }
        }
        try {
            (o)['@version'] = parseInt(x.version);
            if (isNaN((o)['@version'])) {
                (o)['@version'] = new Date().getTime();
            }
        } catch (ex) {
            (o)['@version'] = new Date().getTime();
        }
        if (x.type != null && x.type.indexOf('EncryptedValue') != -1) {
            delete (o)['payload'];
            delete (o)['secret'];
        }

        x.index = getIndexForObject(x.object, x.type);

        let obj = { 'index': { '_index': x.index, '_id': x.id, '_type': getTypeForObject(x.object, x.type), 'version': x.version, 'version_type': 'external' } };
        if (elasticSearchVersion().startsWith('8.')) {
            delete obj.index['_type'];
        }

        body += `${JSON.stringify(obj)}\n`;
        body += `${JSON.stringify(o)}\n`;
    }
    const response = await httpPost(body, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
    if (!response) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'PutIndexBulk', 'No response');
        for (let x of Object.values(map)) {
            failed[x.id] = true;
        }
        return failed;
    }

    if (response.errors) {
        for (let item of response.items) {
            if (item.index.status === 409) {
                // Do nothing
            } else if (item.index.error) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'PutIndexBulk', item);
                let found = Object.values(map).find((x) => x.permanentIds.includes(item.index['_id'].split('.')[0]));
                if (found) {
                    failed[found.id] = true;
                    delete map[found.id];
                }
            }
        }
    }

    let recordsToGet = [...response.items];
    let oldIndexRecords = [];
    while (recordsToGet.length > 0)
        oldIndexRecords.push(...(await skyrepoManyGetIndexRecords.call(this, recordsToGet.splice(0, 1000).filter((x) => !x.index.error && x.index._index !== 'permanent').map((x) => {
            let obj = x.index;
            const erld = new EcRemoteLinkedData(null, null);
            erld.copyFrom(map[obj._id].object);
            if (erld.id != null) {
                return erld.shortId();
            }
        }).filter((x) => x))));

    const recordsToDelete = [];

    for (const oldIndexRecord of oldIndexRecords) {
        let obj = Object.values(map).find((x) => x.id == oldIndexRecord._id);
        if (!obj || obj.index != oldIndexRecord._index) {
            recordsToDelete.push(oldIndexRecord);
        }
    }

    if (recordsToDelete.length > 0) {
        let deleteBody = '';
        for (let record of recordsToDelete) {
            deleteBody += `${JSON.stringify({ delete: { _index: record._index, _id: record._id } })}\n`;
        }
        const deleteResponse = await httpPost(deleteBody, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
    }

    return failed;
};
let skyrepoPutInternal = global.skyrepoPutInternal = async function (o, id, version, type) {
    // Securing Proxy: Sign data that is to be saved.
    const erld = new EcRemoteLinkedData(null, null);
    erld.copyFrom(o);
    if (this.ctx && this.ctx.req && this.ctx.req.eim != null) {
        try {
            await this.ctx.req.eim.sign(erld);
            o = JSON.parse(erld.toJson());
        } catch (msg) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'SkyrepoPutInternalError', msg);
        }
    }
    const oldPermanent = await skyrepoGetPermanent(id, version, type);
    if (isNaN(version)) {
        version = null;
    }
    let chosenVersion = version;
    // If we are doing a manual put with a CASS_LOOPBACK that has an associated CASS_LOOPBACK_PROXY from localhost,
    // we have to pull the version from the object not the url (because it wasn't sent with the url because it's using the md5)
    if (chosenVersion == null && erld.id && (erld.id.startsWith(repo.selectedServer) || erld.id.startsWith(repo.selectedServerProxy))) {
        chosenVersion = erld.getTimestamp();
    }
    if (chosenVersion == null) {
        if (oldPermanent != null && oldPermanent['_version'] != null && !isNaN(oldPermanent['_version'])) {
            chosenVersion = oldPermanent['_version'] + 1;
        } else {
            chosenVersion = 1;
        }
    }
    const obj = await skyrepoPutInternalIndex.call(this, o, id, chosenVersion, type);
    if (erld.id != null) {
        const oldIndexRecords = await skyrepoGetIndexRecords(erld.shortId());
        if (oldIndexRecords != null) {
            for (const oldIndexRecord of oldIndexRecords) {
                if (oldIndexRecord._id != obj._id || oldIndexRecord._index != obj._index) {
                    await skyrepoDeleteInternalIndex.call(this, oldIndexRecord._id, null, oldIndexRecord._index);
                }
            }
        }
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoPutInternal', JSON.stringify(obj));
    }
    const permanentIds = [id];
    if (erld.id != null && erld.getGuid() != null) {
        permanentIds.push(erld.getGuid());
    };
    if (erld.id != null && erld.shortId() != null) {
        permanentIds.push(EcCrypto.md5(erld.shortId()));
    }
    EcArray.removeDuplicates(permanentIds);
    for (const permId of permanentIds) {
        const status = await skyrepoPutInternalPermanent.call(this, o, permId, chosenVersion, type);
        if (status === '409') {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepoPutInternal', '409, version is: ' + chosenVersion);
            const current = await skyrepoGetPermanent.call(this, permId, null, type);
            if (current && current._version > chosenVersion) {
                chosenVersion = current._version;
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepoPutInternal', 'Updated to ' + chosenVersion);
            }
            // Used to replay replication / database log files without "just jamming the data in"
            if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || this.ctx.sanctionedReplay != true) {
                await skyrepoPutInternal.call(this, o, id, chosenVersion + 1, type, true);
            }
            break;
        }
    }
    const rld = new EcRemoteLinkedData(null, null);
    rld.copyFrom(o);
    if (rld.isAny(new EcRekeyRequest().getTypes())) {
        const err = new EcRekeyRequest();
        err.copyFrom(o);
        if (err.verify()) {
            err.addRekeyRequestToForwardingTable();
        }
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepoPutInternal', EcObject.keys(EcRemoteLinkedData.forwardingTable).length + ' records now in forwarding table.');
    }
};
const skyrepoGetIndexInternal = async function (index, id, version, type) {
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepGetIndexInternal', 'Fetching from ' + index + ' : ' + type + ' / ' + id + ' / ' + version);
    }
    const response = await httpGet(getUrl.call(this, index, id, version, type), true, elasticHeaders());
    return response;
};

const skyrepoManyGetIndexInternal = async function (index, manyParseParams) {
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepManyGetIndexInternal', 'Fetching from ' + index + ' : ' + manyParseParams.length);
    }

    const ary = manyParseParams;
    const mget = {};
    const docs = [];
    (mget)['docs'] = docs;
    for (let i = 0; i < ary.length; i++) {
        const parseParams = ary[i];
        const id = (parseParams)['id'];
        const version = (parseParams)['version'];
        const p = {};
        (p)['_index'] = index;
        if (elasticSearchVersion().startsWith('8.')) {
            // Don't multiget with _type
        } else if (elasticSearchVersion().startsWith('7.')) {
            (p)['_type'] = '_doc';
        } else {
            (p)['_type'] = index;
        }
        (p)['_id'] = id + '.' + (version == null ? '' : version);
        docs.push(p);
    }

    const response = await httpPost(mget, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
    return response;
};

const skyrepoGetIndexSearch = async function (id, version, type) {
    const microSearchUrl = elasticEndpoint + '/_search?version&q=_id:' + id + '';
    const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepGetIndexSearch', microSearchUrl);
    }
    if (microSearch == null) {
        return null;
    }
    const hitshits = (microSearch)['hits'];
    if (hitshits == null) {
        return null;
    }
    const hits = (hitshits)['hits'];
    if (hits.length == 0) {
        return null;
    }
    const hit = hits[0];
    return hit;
};

const skyrepoManyGetIndexSearch = async function (ary) {
    let results = [];
    if (ary.length == 0) {
        return results;
    }
    while (ary.length > 0) {
        let batch = ary.splice(0, 10);
        let microSearchUrl = elasticEndpoint + '/_search?version&q=';
        for (let i = 0; i < batch.length; i++) {
            microSearchUrl += '_id:"' + batch[i].id + '"';
            if (i < batch.length - 1) {
                microSearchUrl += ' OR ';
            }
        }

        const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
        if (microSearch.error) throw new Error(microSearch.error.reason);
        if (global.skyrepoDebug) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepManyGetIndexSearch', microSearchUrl);
        }
        if (microSearch == null) {
            return [];
        }
        const hitshits = (microSearch)['hits'];
        if (hitshits == null) {
            return [];
        }
        const hits = (hitshits)['hits'];
        if (hits.length == 0) {
            return [];
        }
        for (let hit of hits)
            results.push(hit);
    }
    return results;
};

let skyrepoGetIndexRecords = async function (id) {
    const hashId = EcCrypto.md5(id);
    const microSearchUrl = elasticEndpoint + '/_search?version&q=@id:"' + id + '" OR @id:"' + hashId + '"';
    const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepGetIndexRecords', microSearchUrl);
    }
    if (microSearch == null) {
        return null;
    }
    const hitshits = (microSearch)['hits'];
    if (hitshits == null) {
        return null;
    }
    const hits = (hitshits)['hits'];
    if (hits.length == 0) {
        return null;
    }
    return hits;
};

let skyrepoManyGetIndexRecords = async function (ary) {
    if (ary.length === 0) {
        return [];
    }
    let hashIds = ary.map((x) => EcCrypto.md5(x));
    let microSearchUrl = "";
    for (let id of ary) {
        microSearchUrl += '@id:"' + id + '" OR ';
    }
    for (let i = 0; i < hashIds.length; i++) {
        microSearchUrl += '@id:"' + hashIds[i] + '"';
        if (i < hashIds.length - 1) {
            microSearchUrl += ' OR ';
        }
    }

    const searchParameters = await (searchObj).call(this, microSearchUrl, null, 10000);
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepSearch', JSON.stringify(searchParameters));
    }
    const microSearch = await httpPost(searchParameters, searchUrl(), 'application/json', false, null, null, true, elasticHeaders());

    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepManyGetIndexRecords', microSearchUrl);
    }
    if (microSearch == null) {
        return [];
    }
    const hitshits = (microSearch)['hits'];
    if (hitshits == null) {
        return [];
    }
    const hits = (hitshits)['hits'];
    if (hits.length == 0) {
        return [];
    }
    return hits;
};

const skyrepoGetIndex = async function (id, version, type) {
    if (type !== undefined && type != null && type != '') {
        const result = await skyrepoGetIndexInternal(type.toLowerCase(), id, version, type);
        return result;
    } else {
        return await skyrepoGetIndexSearch(id, version, type);
    }
};
const skyrepoManyGetIndex = async function (manyParseParams) {
    return await skyrepoManyGetIndexSearch(manyParseParams);
};
const skyrepoGetPermanent = async function (id, version, type) {
    const result = await skyrepoGetIndexInternal.call(this, 'permanent', id, version, type);
    return result;
};
const skyrepoHistoryPermanent = async function (id, version, type) {
    const query = {
        'size': 10000,
        'query': {
            'script': {
                'script': {
                    'source': 'doc[\'_id\'][0].indexOf(params.param1+\'.\') > -1',
                    'lang': 'painless',
                    'params': {
                        'param1': `${id}`,
                    },
                },
            },
        },
    };
    const historyUrl = elasticEndpoint + '/permanent/_search';
    const history = await httpPost(query, historyUrl, 'application/json', null, null, null, null, elasticHeaders());
    // console.log(JSON.stringify(history, null, 2));
    return history;
};
global.skyrepoGetInternal = async function (id, version, type) {
    let result = await skyrepoGetPermanent(id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        return null;
    }
    if ((result)['found'] == true) {
        return JSON.parse(((result)['_source'])['data']);
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepGetInternal', 'Failed to find ' + type + '/' + id + '/' + version + ' -- trying degraded form from search index.');
    }
    result = await (skyrepoGetIndex).call(this, id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        return null;
    }
    if ((result)['found'] == true || (result)['_source'] != null) {
        return (result)['_source'];
    }
    return null;
};
global.skyrepoHistoryInternal = async function (id, version, type) {
    const result = await skyrepoHistoryPermanent(id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        return null;
    }
    if ((result).hits.total.value > 0) {
        const hits = result.hits.hits;
        hits.sort((a, b) => {
            const A = new EcRemoteLinkedData();
            A.copyFrom(JSON.parse(a._source.data));
            const B = new EcRemoteLinkedData();
            B.copyFrom(JSON.parse(b._source.data));
            let Ats = A.getTimestamp();
            let Bts = B.getTimestamp();
            if (Ats == null) Ats = a._source.writeMs;
            if (Bts == null) Bts = b._source.writeMs;
            if (Ats == null || Bts == null) return 0;
            return Bts - Ats;
        });
        for (let i = 0; i < hits.length; i++) {
            for (let j = i; j < hits.length; j++) {
                if (i == j) continue;
                const A = new EcRemoteLinkedData();
                A.copyFrom(JSON.parse(hits[i]._source.data));
                const B = new EcRemoteLinkedData();
                B.copyFrom(JSON.parse(hits[j]._source.data));
                let Ats = A.getTimestamp();
                let Bts = B.getTimestamp();
                if (Ats == null) Ats = hits[i]._source.writeMs;
                if (Bts == null) Bts = hits[j]._source.writeMs;
                // console.log(Ats, Bts);
                if (A.id + Ats == B.id + Bts) {
                    hits.splice(j--, 1); // NOSONAR -- Valid method of filtering.
                }
            }
        }
        return hits.map((h) => JSON.parse(h._source.data));
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoHistoryInternal', 'Failed to find ' + type + '/' + id + '/' + version + '.');
    }
    return null;
};
const skyrepoManyGetPermanent = async function (manyParseParams) {
    const result = await skyrepoManyGetIndexInternal.call(this, 'permanent', manyParseParams);
    return result;
};
let skyrepoManyGetInternal = global.skyrepoManyGetInternal = async function (manyParseParams) {
    let response = await skyrepoManyGetPermanent(manyParseParams);

    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepMGStuff', response);
    }
    let resultDocs = (response)['docs'];
    const results = [];
    const notFoundInPermanent = [];
    if (resultDocs != null) {
        for (let i = 0; i < resultDocs.length; i++) {
            let doc = resultDocs[i];
            if ((doc)['found']) {
                results.push(JSON.parse(((doc)['_source'])['data']));
            } else {
                notFoundInPermanent.push(manyParseParams[i]);
            }
        }
    }

    if (global.skyrepoDebug && notFoundInPermanent.length > 0) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepManyGetInternal', 'Failed to find ' + JSON.stringify(notFoundInPermanent) + ' -- trying degraded form from search index.');
    }

    response = await (skyrepoManyGetIndex).call(this, notFoundInPermanent);

    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepManyGetInternal', 'Index get - ' + JSON.stringify(response));
    }

    let resultDocs2 = (response);
    if (resultDocs2 != null) {
        for (let doc of resultDocs2) {
            results.push(doc['_source']);
        }
    }
    return results;
};
global.skyrepoGet = async function (parseParams) {
    if (parseParams == null && EcObject.isObject(this.params.obj)) {
        parseParams = this.params.obj;
    }
    if (parseParams == null) {
        parseParams = {};
        (parseParams)['id'] = this.params.id;
        (parseParams)['type'] = this.params.type;
        (parseParams)['version'] = this.params.version;
        (parseParams)['history'] = this.params.history;
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepGet', JSON.stringify(parseParams));
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepGet', JSON.stringify(this.params.obj));
    }
    const id = (parseParams)['id'];
    const type = (parseParams)['type'];
    const version = (parseParams)['version'];
    const history = (parseParams)['history'];
    return await (skyrepoGetParsed).call(this, id, version, type, null, history);
};

const skyrepoGetParsed = async function (id, version, type, dontDecrypt, history) {
    let filtered = null;
    if (history == true || history == 'true') {
        filtered = await skyrepoHistoryInternal.call(this, id, version, type);
        filtered = await (filterResults).call(this, filtered, dontDecrypt);
    } else {
        const result = await (skyrepoGetInternal).call(this, id, version, type);
        if (result == null) {
            return null;
        }
        try {
            filtered = await (filterResults).call(this, result, dontDecrypt);
        } catch (ex) {
            if (ex.toString().indexOf('Signature Violation') != -1) {
                throw ex;
            }
        }
    }
    if (filtered == null) {
        return null;
    }
    if (EcObject.keys(filtered).length == 0) {
        return null;
    }
    global.events.data.read.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return filtered;
};
const skyrepoManyGetParsed = async function (manyParseParams) {
    const results = await skyrepoManyGetInternal.call(this, manyParseParams);
    if (results == null) {
        return null;
    }
    let filtered = null;
    try {
        await (signatureSheet).call(this);
        filtered = await (filterResults).call(this, results, null);
    } catch (ex) {
        if (ex.toString().indexOf('Signature Violation') != -1) {
            throw ex;
        }
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'SkyrepManyGetParsedError', ex);
    }
    if (filtered == null) {
        return null;
    }
    global.events.data.read.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return filtered;
};
global.skyrepoPut = async function (parseParams) {
    if (parseParams == null && this.params.id != null && this.params.id != '') {
        parseParams = {};
        (parseParams)['id'] = this.params.id;
        (parseParams)['type'] = this.params.type;
        (parseParams)['version'] = this.params.version;
        (parseParams)['obj'] = this.params.obj;
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepPut', 'put pp:' + JSON.stringify(parseParams));
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepPut', 'put obj:' + JSON.stringify(this.params.obj));
    }
    if (parseParams == null && EcObject.isObject(this.params.obj)) {
        parseParams = this.params.obj;
    }
    let obj = (parseParams)['obj'];
    if (!EcObject.isObject(obj)) {
        obj = JSON.parse(obj);
    }
    const id = (parseParams)['id'];
    const type = (parseParams)['type'];
    const version = (parseParams)['version'];
    return await (skyrepoPutParsed).call(this, obj, id, version, type, null);
};
global.skyrepoPutParsed = async function (o, id, version, type) {
    if (o == null) {
        return;
    }
    await (validateSignatures).call(this, id, version, type, 'Only an owner of an object may change it.', null, null);
    await skyrepoPutInternal.call(this, o, id, version, type);
    global.events.data.write.next([o], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next([o], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
};
global.skyrepoPutParsedBulk = async function (ary) {
    const map = {};
    for (let x of ary) {
        map[x.id] = x;
    }

    const failed = await validateSignaturesBulk.call(this, map, 'Only an owner of an object may change it.');
    // Everything failed already
    if (Object.values(map).length === 0) {
        return failed;
    }

    // Add the additional fails
    Object.assign(failed, await skyrepoPutInternalBulk.call(this, map));

    for (let x of Object.values(map)) {
        let o = x.object;
        const rld = new EcRemoteLinkedData(null, null);
        rld.copyFrom(o);
        if (rld.isAny(new EcRekeyRequest().getTypes())) {
            const err = new EcRekeyRequest();
            err.copyFrom(o);
            if (err.verify()) {
                err.addRekeyRequestToForwardingTable();
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepoPutInternal', EcObject.keys(EcRemoteLinkedData.forwardingTable).length + ' records now in forwarding table.');
        }
    }

    global.events.data.write.next(ary, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next(ary, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return failed;
};
let validateSignatures = async function (id, version, type, errorMessage) {
    const oldGet = await (skyrepoGetInternal).call(this, id, version, type);
    if (oldGet == null) {
        return null;
    }
    const oldObj = new EcRemoteLinkedData(null, null);
    oldObj.copyFrom(oldGet);
    if (oldObj.owner !== undefined && oldObj.owner != null && oldObj.owner.length > 0) {
        const signatures = await ((signatureSheet).call(this));
        let success = false;
        for (let i = 0; i < signatures.length; i++) {
            let owner = signatures[i].owner;
            if (owner == null) {
                owner = (signatures[i])['@owner'];
            }
            if (oldObj.hasOwner(EcPk.fromPem(owner))) {
                success = true;
                break;
            }
            if (EcPk.fromPem(skyrepoAdminPk()).equals(EcPk.fromPem(owner))) {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepoAdminKeyUseDetected', 'Admin override detected.');
                success = true;
                break;
            }
        }
        if (!success) {
            error(errorMessage, 401);
        }
    }
    return oldObj;
};
let validateSignaturesBulk = async function (map, errorMessage) {
    const failed = {};
    const oldGets = await skyrepoManyGetInternal.call(this, Object.values(map));
    const signatures = this.ctx.get('signatureSheet') || [];
    for (let oldGet of oldGets) {
        if (oldGet) {
            const oldObj = new EcRemoteLinkedData(null, null);
            oldObj.copyFrom(oldGet);
            try {
                if (oldObj.owner !== undefined && oldObj.owner != null && oldObj.owner.length > 0) {
                    let success = false;
                    for (let i = 0; i < signatures.length; i++) {
                        let owner = signatures[i].owner;
                        if (owner == null) {
                            owner = (signatures[i])['@owner'];
                        }
                        if (oldObj.hasOwner(EcPk.fromPem(owner))) {
                            success = true;
                            break;
                        }
                        if (EcPk.fromPem(skyrepoAdminPk()).equals(EcPk.fromPem(owner))) {
                            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepoAdminKeyUseDetected', 'Admin override detected.');
                            success = true;
                            break;
                        }
                    }
                    if (!success) {
                        error(errorMessage, 401);
                    }
                }
            } catch (e) {
                let id = oldObj.getGuid();
                failed[id] = true;
                delete map[id];
                id = EcCrypto.md5(oldObj.shortId());
                failed[id] = true;
                delete map[id];
            }
        }
    }
    return failed;
};
let skyrepoDeleteInternalIndex = async function (id, version, type) {
    const url = deleteUrl.call(this, id, version, type);
    return await httpDelete(url, elasticHeaders());
};
const skyrepoDeleteInternalPermanent = async function (id, version, type) {
    const url = deletePermanentBaseUrl(id, version, type);
    return await httpDelete(url, elasticHeaders());
};
global.skyrepoDelete = async function (id, version, type) {
    const oldObj = await (validateSignatures).call(this, id, version, type, 'Only an owner of an object may delete it.');
    if (oldObj == null) {
        console.log("Couldn't find data to delete, removing the index entry.");
        await skyrepoDeleteInternalIndex.call(this, id, version, type);
        return null;
    }
    const ids = [id];
    if (oldObj.id != null && oldObj.getGuid() != null) {
        ids.push(oldObj.getGuid());
    };
    if (oldObj.id != null && oldObj.shortId() != null) {
        ids.push(EcCrypto.md5(oldObj.shortId()));
    }
    EcArray.removeDuplicates(ids);
    if (oldObj != null) {
        for (const id of ids) {
            await skyrepoDeleteInternalIndex.call(this, id, version, type);
            await skyrepoDeleteInternalPermanent.call(this, id, version, type);
        }
    } else {
        error('Can\'t find object to delete', 401);
    }
    global.events.data.delete.next([oldObj], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next([oldObj], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return oldObj;
};
const searchObj = async function (q, start, size, sort, track_scores) {
    const s = {};
    if (start != null) {
        (s)['from'] = start;
    }
    if (size != null) {
        (s)['size'] = size;
    }
    if (sort != null) {
        (s)['sort'] = JSON.parse(sort);
    }
    (s)['version'] = true;
    const query = {};
    (s)['query'] = query;
    const bool = {};
    (query)['bool'] = bool;
    const must = {};
    (bool)['must'] = must;
    const query_string = {};
    (must)['query_string'] = query_string;
    const signatures = await (signatureSheet).call(this);
    (query_string)['query'] = q;
    if (signatures != null && signatures.length > 0) {
        let q2 = '';
        for (let i = 0; i < signatures.length; i++) {
            if (i > 0) {
                q2 += ' OR ';
            }
            q2 += '"' + signatures[i].owner + '"';
        }
        const should = {};
        (bool)['should'] = should;
        const query_string2 = {};
        (should)['query_string'] = query_string2;
        (query_string2)['query'] = q2;
    }
    return s;
};
const searchUrl = function (urlRemainder, index_hint) {
    let url = elasticEndpoint;
    if (index_hint != null && index_hint.indexOf('permanent') != -1) {
        index_hint = null;
    }
    if (urlRemainder != null && urlRemainder != '' && urlRemainder != '/') {
        url += urlRemainder.toLowerCase();
    } else if (index_hint == null) {
        url += '/*,-permanent';
    } else {
        url += '/' + index_hint;
    }
    if (!url.endsWith('/')) {
        url += '/';
    }
    url += '_search';
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepSearchUrl', url);
    }
    return url;
};
const skyrepoSearch = async function (q, urlRemainder, start, size, sort, track_scores, index_hint, originalSize, ids) {
    const searchParameters = await (searchObj).call(this, q, start, size, sort, track_scores);
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepSearch', JSON.stringify(searchParameters));
    }
    const results = await httpPost(searchParameters, searchUrl(urlRemainder, index_hint), 'application/json', false, null, null, true, elasticHeaders());

    // console.log(results);
    //if (global.skyrepoDebug) {
    //    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepSearch', JSON.stringify(results));
    //}
    if (results == null) {
        error('An unknown error has occurred. If using the \'start\' parameter, request may be out of bounds.', 500);
    }
    if ((results)['error'] != null) {
        const root_cause = ((results)['error'])['root_cause'];
        if (root_cause.length > 0) {
            const reasonObj = root_cause[0];
            const reason = (reasonObj)['reason'];
            if (reason != null) {
                error(reason, (results)['status']);
            }
        }
    }
    const hits = ((results)['hits'])['hits'];
    let searchResults = [];
    if (ids != null) {
        try {
            await (signatureSheet).call(this);
            searchResults = await (filterResults).call(this, hits.map((h) => h._source), true);
            global.events.data.found.next(searchResults, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
            global.events.data.any.next(searchResults, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
            searchResults = searchResults.map((x) => x['@id']).filter(x => x);
        } catch (ex) {
            if (ex.toString().indexOf('Signature Violation') != -1) {
                throw ex;
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'SkyrepManyGetParsedError', ex);
        }
    } else {
        for (let i = 0; i < hits.length; i++) {
            const searchResult = hits[i];
            const type = inferTypeFromObj((searchResult)['_source'], null);
            if (type == null) {
                hits.splice(i--, 1); // NOSONAR -- Valid method of filtering.
                continue;
            }
            const id = (searchResult)['_id'];
            let hit = '';
            if (type != null) {
                hit += type + '/';
            }
            hit += id;
            hits[i] = hit;
        }
        searchResults = (await endpointManyGet.call({ ctx: this.ctx, params: { objs: hits }, dataStreams: this.dataStreams })).filter(x => x);
    }
    // If we don't have enough results, and our search hit enough results, and we're not at the size limit, try again with max size.
    originalSize = originalSize || size;
    if (size < 10000 && hits.length >= size && searchResults.length < originalSize) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepPagin8', size, hits.length, searchResults.length);
        return (await skyrepoSearch.call(this, q, urlRemainder, start, Math.min(10000, size + (hits.length * 100 - searchResults.length * 100)), sort, track_scores, index_hint, size, ids)).slice(0, size);
    }
    return searchResults;
};
let queryParse = global.queryParse = function (urlRemainder) {
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
const tryFormatOutput = function (o, expand) {
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
    const parseParams = (queryParse).call(this, urlRemainder, null);
    const id = (parseParams)['id'];
    const type = (parseParams)['type'];
    const version = (parseParams)['version'];
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
                error('Object not found or you did not supply sufficient permissions to access the object.', 404);
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
            error('Object not found or you did not supply sufficient permissions to access the object.', 404);
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
const endpointMultiGet = async function () {
    let ary = JSON.parse(fileToString((fileFromDatastream).call(this, 'data', null)));
    let idsFlag = fileToString((fileFromDatastream).call(this, 'ids', null));
    const lookup = {};
    const mget = {};
    const docs = [];
    (mget)['docs'] = docs;
    for (let i = 0; i < ary.length; i++) {
        const urlRemainder = ary[i].replace('data/', '');
        const parseParams = (queryParse).call(this, urlRemainder, null);
        const id = (parseParams)['id'];
        (lookup)[id] = urlRemainder;
        const version = (parseParams)['version'];
        const p = {};
        (p)['_index'] = 'permanent';
        if (elasticSearchVersion().startsWith('8.')) {
            // Don't multiget with _type
        } else
            if (elasticSearchVersion().startsWith('7.')) {
                (p)['_type'] = '_doc';
            } else {
                (p)['_type'] = 'permanent';
            }
        (p)['_id'] = id + '.' + (version == null ? '' : version);
        docs.push(p);
    }
    const response = await httpPost(mget, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
    const resultDocs = (response)['docs'];
    let results = [];
    if (resultDocs != null) {
        for (let i = 0; i < resultDocs.length; i++) {
            const doc = resultDocs[i];
            if ((doc)['found']) {
                delete (lookup)[((doc)['_id']).substring(0, ((doc)['_id']).indexOf('.'))];
                results.push(JSON.parse(((doc)['_source'])['data']));
            }
        }
    }
    await (signatureSheet).call(this);
    await (filterResults).call(this, results, idsFlag != null ? true : null);
    ary = EcObject.keys(lookup);
    for (let i = 0; i < ary.length; i++) {
        ary[i] = (lookup)[ary[i]];
    }
    if (ary != null) {
        const me = this;
        const forEachResults = [];
        while (ary.length > 0)
            forEachResults.push(...await Promise.all(ary.splice(0, 100).map(function (hit) {
                return endpointSingleGet.call({ ctx: me.ctx, params: { obj: hit }, dataStreams: me.dataStreams }, idsFlag != null ? true : null);
            })));
        for (let i = 0; i < forEachResults.length; i++) {
            if (forEachResults[i] != null) {
                results.push(forEachResults[i]);
            }
        }
    }
    if (idsFlag != null ? true : false) {
        results = results.map((x) => x['@id']);
    }
    return JSON.stringify(results);
};
const endpointMultiPutEach = async function () {
    const ld = new EcRemoteLinkedData(null, null);
    const o = this.params.obj;
    ld.copyFrom(o);
    let id = null;
    if (!EcRepository.alwaysTryUrl && repo != null && !repo.constructor.shouldTryUrl(ld.id) && ld.id.indexOf(repo.selectedServerProxy) == -1 && ld.id.indexOf(repo.selectedServer) == -1) {
        id = EcCrypto.md5(ld.shortId());
    } else {
        id = ld.getGuid();
    }
    let version = ld.getTimestamp();
    if (isNaN(version)) {
        version = null;
    }
    const type = ld.getDottedType();
    try {
        this.ctx.put('refresh', 'false');
        await (skyrepoPutParsed).call(this, o, id, version, type);
        return o;
    } catch (ex) {
        // debug(ex);
    }
    return null;
};
const endpointMultiPutBulk = async function () {
    const ary = this.params.ary;
    this.ctx.put('refresh', 'false');
    const failed = await (skyrepoPutParsedBulk).call(this, ary);
    return ary.filter((x) => !failed[x.id]).map((x) => x.object);
};
const endpointMultiPut = async function () {
    const ary = JSON.parse(fileToString((fileFromDatastream).call(this, 'data', null)));
    const results = [];
    if (ary != null) {
        // The following is also in skyrepoPutInternalPermanent. Adding it here avoids trying to create the permanent index for each object in multiput.
        if (permanentCreated != true) {
            const mappings = {};
            const permNoIndex = {};
            const doc = {};
            (mappings)['mappings'] = permNoIndex;

            if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
                permNoIndex.enabled = false;
            } else {
                (permNoIndex)['permanent'] = doc;
            }
            (doc)['enabled'] = false;
            const result = await httpPut(mappings, elasticEndpoint + '/permanent', 'application/json', elasticHeaders());
            if (global.skyrepoDebug) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepEndpointMultiput', JSON.stringify(result));
            }
            permanentCreated = true;
        }
        await ((signatureSheet).call(this));

        const uniques = {};
        for (let x of ary) {
            const ld = new EcRemoteLinkedData(null, null);
            const o = x;
            ld.copyFrom(o);
            let id = null;
            if (!EcRepository.alwaysTryUrl && repo != null && !repo.constructor.shouldTryUrl(ld.id) && ld.id.indexOf(repo.selectedServerProxy) == -1 && ld.id.indexOf(repo.selectedServer) == -1) {
                id = EcCrypto.md5(ld.shortId());
            } else {
                id = ld.getGuid();
            }
            let version = ld.getTimestamp();
            if (isNaN(version)) {
                version = null;
            }
            const type = ld.getDottedType();
            uniques[id] = {
                object: o,
                id: id,
                version: version,
                type: type,
            };
        }

        const uniqueAry = Object.values(uniques);

        while (uniqueAry.length > 0) {
            results.push(...(await endpointMultiPutBulk.call({ ctx: this.ctx, dataStreams: this.dataStreams, params: { ary: uniqueAry.splice(0, parseInt(process.env.MULTIPUT_BATCH_SIZE || 100)) } })).filter((x) => x != null));
        }
    }
    await httpGet(elasticEndpoint + '/_all/_refresh', true, elasticHeaders());
    global.events.database.afterSave.next(results);
    return JSON.stringify(results);
};
const endpointSingleGet = async function (dontDecrypt) {
    const urlRemainder = this.params.obj;
    const parseParams = (queryParse).call(this, urlRemainder, null);
    const id = (parseParams)['id'];
    const type = (parseParams)['type'];
    const version = (parseParams)['version'];
    const o = await (skyrepoGetParsed).call(this, id, version, type, dontDecrypt, null);
    if (o != null) {
        return o;
    }
    return null;
};
const endpointManyGet = async function () {
    const manyParseParams = [];
    for (const urlRemainder of this.params.objs) {
        const parseParams = (queryParse).call(this, urlRemainder, null);
        manyParseParams.push(parseParams);
    }
    if (manyParseParams.length == 0) {
        return [];
    }
    const o = await (skyrepoManyGetParsed).call(this, manyParseParams);
    if (o != null) {
        return o;
    }
    return null;
};
const skyRepoSearch = async function () {
    let q = this.params.q;
    const urlRemainder = this.params.urlRemainder;
    let start = 0;
    if (this.params.start != undefined) {
        if (this.params.start != null) {
            start = parseInt(this.params.start);
        }
    }
    let size = 50;
    if (this.params.size != undefined) {
        if (this.params.size != null) {
            size = parseInt(this.params.size);
        }
    }
    let sort = this.params.sort;
    let track_scores = this.params.track_scores;
    let index_hint = this.params.index_hint;
    let ids = this.params.ids;
    const searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, 'searchParams', null)));
    if (searchParams != null) {
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
        if ((searchParams)['ids'] != undefined) {
            if ((searchParams)['ids'] != null) {
                ids = (searchParams)['ids'];
            }
        }
    }
    const data = fileToString((fileFromDatastream).call(this, 'data', null));
    if (data !== undefined && data != null && data != '') {
        q = data;
    }
    if (q === undefined || q == null || q == '') {
        q = '*';
    }
    return JSON.stringify(await (skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores, index_hint, null, ids));
};
/**
 * @openapi
 * /api/sky/repo/search:
 *   get:
 *     tags:
 *       - Search
 *     deprecated: true
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
 *     deprecated: true
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
 */
bindWebService('/sky/repo/search', skyRepoSearch);
const endpointAdmin = function () {
    return JSON.stringify(skyrepoAdminList());
};
const skyrepoAdminPk = global.skyrepoAdminPk = function () {
    if (!fs.existsSync('etc/skyAdmin2.pem')) {
        fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), 'etc/skyAdmin2.pem');
    }
    return EcPpk.fromPem(fileToString(fileLoad('etc/skyAdmin2.pem'))).toPk().toPem();
};
const skyrepoAdminList = global.skyrepoAdminList = function () {
    const array = [];
    array.push(skyrepoAdminPk());

    let mayHaveUserAdmins = process.env.AUTH_ALLOW_ENV_ADMINS == "true";
    if (mayHaveUserAdmins) {
        let knownAdminPks = sharedAdminCache.getKnownUserAdminPks();
        for (let userPk of knownAdminPks) {
            array.push(userPk);
        }
    }

    return array;
};
/**
 * @openapi
 * /api/sky/admin:
 *   get:
 *     tags:
 *       - Infrastructure
 *     description: Fetches public key of the admin user. An identity with the corresponding private key will have edit/delete capabilities over all data.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Array of admin public keys
 *               example: ["<public key>"]
 */
bindWebService('/sky/admin', endpointAdmin);
// When CORS_CREDENTIALS is true, inform the cass client that all requests to the urls specified in CORS_ORIGINS should be made with credentials
const getCorsOrigins = function () {
    let corsOrigins;
    if (process.env.CORS_CREDENTIALS != null && process.env.CORS_CREDENTIALS.trim() == 'true' && process.env.CORS_ORIGINS != null) {
        try {
            corsOrigins = process.env.CORS_ORIGINS.split(',').map((x) => x.trim());
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'CorsConfigError', 'Misconfigured CORS_ORIGINS env var, ensure the value is a comma separated list of origins');
        }
    }
    return corsOrigins;
};
let realCrypto = require('crypto');
const pingWithTime = function () {
    if (this.ctx?.req?.eim?.ids)
        global.events.person.doPing(this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()));
    return JSON.stringify({
        ping: 'pong',
        time: new Date().getTime(),
        ssoViaP1: this.ctx.req.p1 ? true : null,
        ssoPublicKey: this.ctx.req.eim ? this.ctx.req.eim.ids[0].ppk.toPk().toPem() : undefined,
        ssoAdditionalPublicKeys: this.ctx.req.eim && this.ctx.req.eim.ids.length ? this.ctx.req.eim.ids.slice(1).map((identity) => identity.ppk.toPk().toPem()) : undefined,
        ssoLogin: this.ctx.req.oidc ? (process.env.CASS_OIDC_BASE_URL || 'http://localhost/') + 'api/login' : undefined,
        ssoLogout: this.ctx.req.oidc ? (process.env.CASS_OIDC_BASE_URL || 'http://localhost/') + 'api/logout' : undefined,
        banner: process.env.CASS_BANNER_MESSAGE ? {
            message: process.env.CASS_BANNER_MESSAGE, // string
            color: process.env.CASS_BANNER_TEXT_COLOR, // valid css color value
            background: process.env.CASS_BANNER_BACKGROUND_COLOR, // valid css color value
        } : undefined,
        motd: process.env.MOTD_MESSAGE ? {
            title: process.env.MOTD_TITLE,
            message: process.env.MOTD_MESSAGE,
        } : undefined,
        plugins: process.env.DEFAULT_PLUGINS ? process.env.DEFAULT_PLUGINS : undefined,
        adminPublicKeys: skyrepoAdminList(),
        corsOrigins: getCorsOrigins(),
        postMaxSize: global.postMaxSize,
        signatureSheetHashAlgorithm: 'SHA-256',
        fips: realCrypto.getFips(),
    });
};
/**
 * @openapi
 * /api/ping:
 *   get:
 *     tags:
 *       - Infrastructure
 *     description: Fetches server parameters along with information about you, if SSO is enabled.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Ping response
 *               additionalProperties: false
 *               required:
 *                 - ping
 *                 - time
 *                 - adminPublicKeys
 *                 - postMaxSize
 *               properties:
 *                 ping:
 *                   type: string
 *                   description: Just a known value for ensuring the response isn't from something else.
 *                   example: pong
 *                 time:
 *                   type: integer
 *                   description: The current number of milliseconds since the Unix epoch, for ensuring signature sheet signing can sign time-nonced signatures that will not be time-desynchronized with the server.
 *                   example: 1674857764808
 *                 ssoViaP1:
 *                   type: boolean
 *                   description: A flag indicating that the user logged in through a Platform One JWT.
 *                   example: true
 *                 ssoPublicKey:
 *                   type: string
 *                   description: When logged in with SSO, the public key of the first key in the keyring.
 *                   example: <public key>
 *                 ssoAdditionalPublicKeys:
 *                   type: array
 *                   description: When logged in with SSO, the public keys of keys past the first in the keyring.
 *                   example: ["<public key>"]
 *                 ssoLogin:
 *                   type: string
 *                   description: When logged in with OIDC (or similar), the URL of the login redirect page, using CASS_OIDC_BASE_URL environment variable for the endpoint.
 *                   example: http://localhost/api/login
 *                 ssoLogout:
 *                   type: string
 *                   description: When logged in with OIDC (or similar), the URL of the logout redirect page, using CASS_OIDC_BASE_URL environment variable for the endpoint.
 *                   example: http://localhost/api/logout
 *                 banner:
 *                   type: object
 *                   required:
 *                     - message
 *                     - color
 *                     - background
 *                   description: If specified in CASS_BANNER_MESSAGE, CASS_BANNER_TEXT_COLOR, CASS_BANNER_BACKGROUND_COLOR environment variables communicated from the server.
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Banner text as specified by CASS_BANNER_MESSAGE environment variable.
 *                       example: <Security markings>
 *                     color:
 *                       type: string
 *                       description: CSS text color as specified by CASS_BANNER_TEXT_COLOR environment variable.
 *                       example: red
 *                     background:
 *                       type: string
 *                       description: CSS background color as specified by CASS_BANNER_BACKGROUND_COLOR environment variable.
 *                       example: yellow
 *                 motd:
 *                   type: object
 *                   description: If specified in MOTD_TITLE, MOTD_MESSAGE environment variables communicated from the server.
 *                   required:
 *                     - message
 *                     - color
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Message of the Day title as specified by MOTD_TITLE environment variable.
 *                       example: Message of the Day
 *                     color:
 *                       type: string
 *                       description: Message of the Day text as specified by MOTD_MESSAGE environment variable.
 *                       example: Have a good day!
 *                 adminPublicKeys:
 *                   type: array
 *                   description: Array of admin public keys
 *                   example: ["<public key>"]
 *                 corsOrigins:
 *                   type: array
 *                   description: For which origins should the cass client include credentials for in its requests.
 *                   example: ["http://localhost"]
 *                 postMaxSize:
 *                   type: number
 *                   description: Max size of fields and files in POST requests that this server can handle in bytes.
 */
bindWebService('/ping', pingWithTime);
/**
 * @openapi
 * /api/sky/repo/multiGet:
 *   post:
 *     tags:
 *       - Repository
 *     description: 'Fetches multiple pieces of data simultaneously. Note, testing this function does not work. See: https://stackoverflow.com/questions/68291244/how-to-format-a-json-array-in-the-request-body-of-a-multipart-form-data-request/68291856#68291856'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/MultiGetParams'
 *               signatureSheet:
 *                 $ref: '#/components/schemas/SignatureSheet'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 */
bindWebService('/sky/repo/multiGet', endpointMultiGet);
/**
 * @openapi
 * /api/sky/repo/multiPut:
 *   post:
 *     tags:
 *       - Repository
 *     description: 'Stores multiple pieces of data simultaneously. Note, testing this function does not work. See: https://stackoverflow.com/questions/68291244/how-to-format-a-json-array-in-the-request-body-of-a-multipart-form-data-request/68291856#68291856'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/JsonLdArray'
 *               signatureSheet:
 *                 $ref: '#/components/schemas/SignatureSheet'
 *     responses:
 *       200:
 *         description: Returns data that was saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 */
bindWebService('/sky/repo/multiPut', endpointMultiPut);
