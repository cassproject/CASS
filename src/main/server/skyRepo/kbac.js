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
const { skyrepoGetInternal } = require('./get');
const { skyrepoManyGetInternal } = require('./multiget');
const objectNotFoundError = 'Object not found or you did not supply sufficient permissions to access the object.';

const signatureSheetEach = async function (obj) {
    const signature = new EbacSignature();
    signature.copyFrom(obj);
    if (signature == null)
        error('Missing Signature.', 496);

    let owner = signature.owner || signature["@owner"];
    signature['@owner'] = owner;
    delete signature.owner;

    const ownerPk = EcPk.fromPem(owner);
    global.auditLogger.report(global.auditLogger.LogCategory.SECURITY, global.auditLogger.Severity.NETWORK, 'CassIdentity', ownerPk.fingerprint());

    const validTypes = signature.getTypes();
    // Check if the signature type is valid
    if (!validTypes.some(validType => validType == getTypeFromObject(obj))) {
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
    return signature;
};
global.signatureSheet = async function () {
    let sigSheet = this.ctx.get('signatureSheet');
    if (sigSheet != null)
        return sigSheet;
    sigSheet = [];

    const fromDatastream = (fileFromDatastream).call(this, 'signatureSheet', null);
    const stringFromDatastream = fileToString(fromDatastream);
    if (stringFromDatastream != null)
        try {
            sigSheet = sigSheet.concat(JSON.parse(stringFromDatastream));
        } catch {
            error('Missing or Malformed Signature.', 496);
        }

    const hdrs = headers.call(this);
    if (hdrs.signatureSheet != null || hdrs.signaturesheet != null) {
        sigSheet = sigSheet.concat(JSON.parse(hdrs.signatureSheet || hdrs.signaturesheet));
    }

    sigSheet = await Promise.all(sigSheet.map(async (sig) => {
        return await signatureSheetEach.call(this, sig);
    }));

    this.ctx.put('signatureSheet', sigSheet);
    return sigSheet;
};
const eevPrototype = new EcEncryptedValue();
global.filterResults = async function (o, dontDecryptInSso) {
    if (o == null)
        return o;
    if (EcArray.isArray(o)) {
        return (await Promise.all(o.map(async (x) => {
            try {
                return await filterResults.call(this, x, dontDecryptInSso);
            } catch (ex) {
                if (ex != null && ex.toString().indexOf(objectNotFoundError) == -1) {
                    throw ex;
                }
                return null;
            }
        }))).filter((x) => x);
    } else if (EcObject.isObject(o)) {
        delete o.decryptedSecret;
        const rld = new EcRemoteLinkedData().copyFrom(o);
        if ((rld.reader != null && rld.reader.length != 0) || rld.isAny(eevPrototype.getTypes())) {
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
                throw new Error(objectNotFoundError);
            }
            // Securing Proxy: Decrypt data that is being passed back via SSO.
            if (this.ctx.req.eim != null && dontDecryptInSso == null) {
                try {
                    let eev = new EcEncryptedValue();
                    eev.copyFrom(o);
                    o.decryptedSecret = await eev.decryptSecret(this.ctx.req.eim);
                } catch (msg) {
                    global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'CassDecryptError', 'We couldn\'t decrypt it, hope the client has better luck! -- ' + msg);
                }
            }
        }
        await Promise.all(EcObject.keys(o).map(async (key) => {
            try {
                o[key] = await filterResults.call(this, o[key], dontDecryptInSso);
            } catch (ex) {
                if (ex != null && ex.toString().indexOf(objectNotFoundError) == -1) {
                    throw ex;
                }
                delete o[key];
            }
            if (o[key] == null)
                delete o[key];
        }));
        return o;
    } else {
        return o;
    }
};

global.validateSignatures = async function (id, version, type, errorMessage) {
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
                global.auditLogger.report(global.auditLogger.LogCategory.SECURITY, global.auditLogger.Severity.INFO, 'SkyrepoAdminKeyUseDetected', 'Admin override detected.');
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
global.validateSignaturesBulk = async function (map, errorMessage) {
    const failed = {};
    const succeeded = [];
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
                            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.INFO, 'SkyrepoAdminKeyUseDetected', 'Admin override detected.');
                            success = true;
                            break;
                        }
                    }
                    if (!success) {
                        throw new Error(errorMessage);
                    } else {
                        succeeded.push(oldObj);
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
    return {succeeded,failed};
};

module.exports = {
    objectNotFoundError
};