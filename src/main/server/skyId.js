const fs = require('fs');
let usernameSalt = null;
let passwordSalt = null;
let secretSalt = null;
let skyIdSalt = null;
let skyIdSecretStr = null;
global.skyIdSecret = function() {
    return skyIdSecretStr;
};
let skyIdSecretKey = null;
let skyIdPem = null;
let cachedSalts = {};
let salts = function() {
    return JSON.stringify(cachedSalts);
};
let skyIdCreate = async function() {
    let id = null;
    let password = null;
    let credentials = null;
    let searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, 'credentialCommit', null)));
    if (searchParams != null) {
        if ((searchParams)['username'] != undefined) {
            if ((searchParams)['username'] != null) {
                id = (searchParams)['username'];
            }
        }
        if ((searchParams)['password'] != undefined) {
            if ((searchParams)['password'] != null) {
                password = (searchParams)['password'];
            }
        }
        if ((searchParams)['credentials'] != undefined) {
            if ((searchParams)['credentials'] != null) {
                credentials = (searchParams)['credentials'];
            }
        }
    }
    if (id == null) {
        error('Missing username.', 422);
    }
    if (password == null) {
        error('Missing password.', 422);
    }
    let payload = credentials;
    let saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    (payload)['password'] = saltedPassword;
    let saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    let signatureSheet = [];
    signatureSheet.push(await EcIdentityManager.default.createSignature(60000, null, skyIdPem));
    this.ctx.put('signatureSheet', signatureSheet);
    let get = await (skyrepoGetInternal).call(this, saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue', null);
    if (get != null) {
        get = JSON.parse(await EcAesCtrAsync.decrypt((get)['payload'], skyIdSecretKey, saltedId));
    }
    let encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(payload), skyIdSecretKey, saltedId);
    if (get == null) {
        await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue');
    } else {
        error('Cannot create, account already exists.', 422);
    }
    return null;
};
let skyIdCommit = async function() {
    let id = null;
    let password = null;
    let token = null;
    let credentials = null;
    let searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, 'credentialCommit', null)));
    if (searchParams != null) {
        if ((searchParams)['username'] != undefined) {
            if ((searchParams)['username'] != null) {
                id = (searchParams)['username'];
            }
        }
        if ((searchParams)['password'] != undefined) {
            if ((searchParams)['password'] != null) {
                password = (searchParams)['password'];
            }
        }
        if ((searchParams)['token'] != undefined) {
            if ((searchParams)['token'] != null) {
                token = (searchParams)['token'];
            }
        }
        if ((searchParams)['credentials'] != undefined) {
            if ((searchParams)['credentials'] != null) {
                credentials = (searchParams)['credentials'];
            }
        }
    }
    if (id == null) {
        error('Missing username.', 422);
    }
    if (password == null) {
        error('Missing password.', 422);
    }
    if (token == null) {
        error('Missing token.', 422);
    }
    let payload = credentials;
    (payload)['token'] = token;
    let saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    (payload)['password'] = saltedPassword;
    let saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    let encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(payload), skyIdSecretKey, saltedId);
    let signatureSheet = [];
    signatureSheet.push(await EcIdentityManager.default.createSignature(60000, null, skyIdPem));
    this.ctx.put('signatureSheet', signatureSheet);
    let get = await (skyrepoGetInternal).call(this, saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue', null);
    if (get == null) {
        error('User does not exist.', 404);
    }
    get = JSON.parse(await EcAesCtrAsync.decrypt((get)['payload'], skyIdSecretKey, saltedId));
    if ((get)['token'] != token) {
        error('An error in synchronization has occurred. Please re-login and try again.', 403);
    }
    await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue');
    return null;
};
let skyIdLogin = async function() {
    let id = null;
    let password = null;
    let searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, 'credentialRequest', null)));
    if (searchParams != null) {
        if ((searchParams)['username'] !== undefined) {
            if ((searchParams)['username'] != null) {
                id = (searchParams)['username'];
            }
        }
        if ((searchParams)['password'] != undefined) {
            if ((searchParams)['password'] != null) {
                password = (searchParams)['password'];
            }
        }
    }
    if (id == null) {
        error('Missing username.', 422);
    }
    if (password == null) {
        error('Missing password.', 422);
    }
    let saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    let saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    let signatureSheet = [];
    signatureSheet.push(await EcIdentityManager.default.createSignature(60000, null, skyIdPem));
    this.ctx.put('signatureSheet', signatureSheet);
    let get = await (skyrepoGetInternal).call(this, saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue', null);
    if (get == null) {
        error('User does not exist.', 404);
    }
    get = JSON.parse(await EcAesCtrAsync.decrypt((get)['payload'], skyIdSecretKey, saltedId));
    if ((get)['password'] != saltedPassword) {
        error('Invalid password.', 403);
    }
    (get)['token'] = randomString(20);
    let lastLogin = (get)['lastLogin'] || Date.now();
    (get)['lastLogin'] = Date.now(); // Save current time as lastLogin
    let encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(get), skyIdSecretKey, saltedId);
    await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue');
    delete (get)['password'];
    (get)['lastLogin'] = lastLogin;
    return JSON.stringify(get);
};
global.loadConfigurationFile = function(path, dflt) {
    if (fs.existsSync('etc') == false) {
        fs.mkdirSync('etc');
    }
    let pathParts = path.split('/');
    pathParts.pop();
    let cumulativePath = 'etc/';
    for (let path of pathParts) {
        cumulativePath += path + '/';
        if (fs.existsSync(cumulativePath) == false) {
            fs.mkdirSync(cumulativePath);
        }
    }
    if (fs.existsSync(path)) {
        return fileToString(fileLoad(path));
    }
    if (fs.existsSync('etc/' + path)) {
        return fileToString(fileLoad('etc/' + path));
    }
    if (dflt == null) {
        return null;
    }
    let def = dflt();
    if (def != null) {
        fileSave(def, 'etc/' + path);
    } else {
        return null;
    }
    return fileToString(fileLoad('etc/' + path));
};
(function() {
    usernameSalt = loadConfigurationFile('skyId.username.public.salt', function() {
        return randomString(2048);
    });
    passwordSalt = loadConfigurationFile('skyId.password.public.salt', function() {
        return randomString(2048);
    });
    secretSalt = loadConfigurationFile('skyId.secret.public.salt', function() {
        return randomString(2048);
    });
    (cachedSalts)['usernameSalt'] = usernameSalt;
    (cachedSalts)['usernameIterations'] = 5000;
    (cachedSalts)['usernameLength'] = 64;
    (cachedSalts)['passwordSalt'] = passwordSalt;
    (cachedSalts)['passwordIterations'] = 5000;
    (cachedSalts)['passwordLength'] = 64;
    (cachedSalts)['secretSalt'] = secretSalt;
    (cachedSalts)['secretIterations'] = 5000;
    (cachedSalts)['secretLength'] = 64;
    skyIdSalt = loadConfigurationFile('skyId.salt', function() {
        return randomString(2048);
    });
    skyIdSecretStr = loadConfigurationFile('skyId.secret', function() {
        return randomString(2048);
    });
    skyIdSecretKey = forge.util.encode64(forge.pkcs5.pbkdf2(skyIdSecretStr, skyIdSalt, 10000, 16));
    skyIdPem = EcPpk.fromPem(loadConfigurationFile('skyId.pem', function() {
        return EcPpk.fromPem(rsaGenerate()).toPem();
    }));
/**
 * @openapi
 * /api/sky/id/salts:
 *   get:
 *     tags:
 *       - Basic Keystore
 *     description: Retrieves salt parameters from server for performing PBKDF2 hashing of usernames and passwords.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Parameters for hashing credentials.
 *               properties:
 *                 usernameSalt:
 *                   type: string
 *                   description: Salt for the username.
 *                 usernameIterations:
 *                   type: integer
 *                   description: Number of PBKDF2 iterations to perform on the username.
 *                 usernameLength:
 *                   type: integer
 *                   description: Size of PBKDF2 hash for the username.
 *                 passwordSalt:
 *                   type: string
 *                   description: Salt for the password.
 *                 passwordIterations:
 *                   type: integer
 *                   description: Number of PBKDF2 iterations to perform on the password.
 *                 passwordLength:
 *                   type: integer
 *                   description: Size of PBKDF2 hash for the password.
 *                 secretSalt:
 *                   type: string
 *                   description: Salt for the secret used to encrypt the keystore.
 *                 secretIterations:
 *                   type: integer
 *                   description: Number of PBKDF2 iterations to perform on the secret.
 *                 secretLength:
 *                   type: integer
 *                   description: Size of PBKDF2 hash for the secret.
 *               example: {"usernameSalt":"CLXTsjSZsHKxPZvovczkuxkObTHiLoNwgjwGifrIKylkrrZDboaOIgeDRrrYNgTRMysXYLMDOdCWSNUizoGUhrImmtOaOHxUfKnUOMcVsphRvBNpHPPDcGrLnQwvkQNceGycBDogZSBdSZoYkbJdfwamSgMSuCgHdPwtvVVaWScPGlcCHobadsywRyZEzmItYkiIqXpTVAQXlIbwEFCaCoqDMcgjWZRHxtgsKVZIgpHodlrMHYVPXzPdnymHLlLdYfddznJGDbUBSzmuurzuQQnLEiVZSQvGbZblwSETZApdBqwOKTtlnnbsQPfzpmatlgeNCBqiKnBcfwcRicINNIMUSDDjmMsaxmsOApQucbUBckYqVnwkMtPaQmkiCTFcatQEZyJtMbsENHnPHCfCnPOTTtZGJPwyNxPvcmErNDtDSHZWrHoQAFKHivrzCOdqKwLDgwMJOGQegAKyQJLFJVEKlqbHvuEvQzeAOBgcaDPMtNqCBpjoUOjoOMbXnivVsiUDlWBBenINvguHxorHzAacOHYAmmCZTVXzDXTmdhoGpmJWCKEYBKHsiXYMYvHacsqiuGgyhCzJRQulbGfofVFOpjCYBvMeEsHmyKhsJeYTXJImVhDtPntOsfClPWnPDjGMLSgBddiOceuKNeGBAIduNRYLpRrpvfsKGSYjCUgOWJIyJHqgtRErYCtCKNLwmhnUGfjQJsxNImhKHZspJfngYCrSeOkyMdUrVVmplleHAOYytWhbLTvMhyMyyBwFdHvCwAZAZsSIoLdwsGfsIUJPesmAcSWKOnzFNoDCnwLULZJyBdcYBqVhfrFbmXSvhzdSVsnpJymvwMGotSFUZWCzaQJlwAvQgsVZrOUFfezzMroCHoFCPjBFfyjWySrAJRUmKGnWeBrKfKuHuZYyKVkvZEiYbcjrMfwzTGYWIVWbaNeHmfDXPxHGzzreygnybJTuPUqkOPeEPMfEssieVPIWcsdLOfBEyXSFrxOPkrHhIKpcpooBDlcFgohfuNYVfXmOjXNXxysvWlapwpdDMuFhCWNUiIYCZvYtoOGmbzqdbBwWqSnnVDxUwGtqkTovAwYhIlYFalOVTkAcDgXHqkUMfFcrNdoaThDSvCFFoIIdJIsQpEFpwFxkvcYNKhABwPQWzNtcBGqeZYFKwkvzPDcHkpkTnYvxdwxEGGFderbDuVRdkZguyzenGwGgCTvphcnWorwPPjOQEDvPWpZGTDLvEYtnUUEgrJXJwmODykoAgeWwZrjXJUpHHxjTMvmNEEEJdRIuMtmOWKfukpfwnfNRqhMkbLkXUvVkacGRVGTvEXFAIGqbYCytGfjHeNmWpMPxPpFvXeIzOqZmibaNISiPOTTvDHwHmqGNIHSWpHSwIOGnhHLrAJsvOiUnNxfqWhjOPWRyoIOoPeZHxOUptngvhSqABLIhphyasYBjYbPMzoHZtViJneHftoMOlJBUOQnbogYnIThRIUECXwPhicyWSNcDBsZfQRpELwYlJjtFsghTRKDdyDymMstWRkhHkKqNUSIzpWJiatUZopinRmkQmUzGmNnWyUwGaqpAGmSurYZYwBBdGyqcLiHJnRHamcWrHriWZyEETQgHpkqblGYhtDAIWcCnMaoqgOwNUZabjXtJEhlZZIHiOmCJAceXacVtyuhWPfVmrofogYXmiPflIJvGzGfyzyjsIycAdwMBqhsmmFAkHdOgtXrOvSEunMpojAXQUSyhTblMGYHbcdGaolzWRnziZIdXPTHdgnzyWgpOoIQMVEawDzVChVLlSBwIARSaiIZfycABtauwOgIFmKwuAfwiRHpQvuAdxrPBvwAOgrNQULZYXsWMlxBsnjuzekMZkXVnccEMlXbvNuCRTktsGevDBEOkasKWuLMxScddJuDLxwrdHSirzoaIeTCWWBZMkceeyXIdneOpyBnInuXDuBfJsnVsNAcUMIZCcwWRRufWMPbyuEHZhPkbCiYVXXcrGmHTGueSpPooTDYmSYKlgeyceDgcwXMxJEOMbCvIxDsBJtzsxaefkcDo","usernameIterations":5000,"usernameLength":64,"passwordSalt":"IWlyUNiAqFvMrQzQoZJyNqfAqoMFwVbceBOOnAEPGsGwKpAnDhohpznHpGVHFyUPWPnKMBcIMvbApDoKsjJbsxqcaDJnyPALYRhEkoiwagEDBghadQObuvqPayYxlERuhxjXrWijDKidBeyNYnhqaftMRmJnbaSkvGOEiWKPJNegCodzfQYrNtwGRfyRRlvBjUSJtJQmIAwzvsbKgcVfBrosgjofVcFtmnPCmIMCnuUoQbkgNtdJdbtXWIeWcJkZdZRHYFRecLNHQDZqEpnZJZMsaUxLdMAYmktPJFBGpRNpFePoDYYqqbsyCFLElXoYVaZRinfawKwoCFYdQrnbpKdtzWfzANeRcfJiuPiPPFcZWkBdEqhIQFXtZkxsHBkLxCWASNbTjNAwvgLYCWxfLunLpVHNsFBiFlvxxhCghwlOxAQBqVmmdzMmFAcaSbxUdFBKtyecuGWaHXdiNTkCQlBuAysQNHOqqtLCBarWKjMgGJBeRyBNUXgbPWZyQkDLlcVlVsnYQxVkXjzWGyPByKjzyTavADBVtfRQZHyUnwmfBrRxGzuBVpYKBJXVnqZrbHYgeDFgRTZCYEAGHBtGfCLttUPMXviNUbWGqJLVZxqsBBONKKuAXscfpnQLOQJUJaSNVujbFWcxtiOKZQarIRqbLvvxdERzRTNVJjEOblkFhSmYFdIsJacYkaFwOiDcBGXkQofNUfndlhCpEheBEtOFNsvjSrsuaczCThVYYrjhipYUoRCnZgcBRDgscYdUzTXQeRCXiQiWEZiCHovxUMHyFKSXWkRbFaUZQwptPJGTCtbmmZXIeietVUpWkwBDJAmNWQJoDXdwxREPedkNDsbfhzlPCGeJluJKhPJfvMxLXCUDzOWDVDEbhmOSgQSHmibvyjnxWPGkpftyCNzZisOKEsykWtfTMyGHDykeKLjmPLqNzHLHKQuyRKwahASkaQLWkzcLoDqpeSjDzJOdLKtHWxXDACKTaFwoAATcxbsBIqZEJSgmzYmErjoyQzrptScNBXSwNyxBjWOlaFsqrFYvzcbnLGRhIpVhzxybSMgptkujdugoBDrHCteChoFzTbwDMZCwpGFdxTaJcSYyFetNtVXGHtMWNiqKjicRdGLPykTcEzQttKMUuqMlsEwPkYFrEiagucMwLXSrKLmGjXDaAVxxtyRkIYwBYzxDIhuVIhhajGwNTzxZWqVJfHBmEIboGhjXqngwngsfUZgoJmlMhaIYItqgjeBIQiqjIxBBVOnPocsQGdUyLCUSroIqWZWvsQBXWJpLQfLekyzpqSfioIMTRwDiwAVHsoETaTCiTUFxRLddZhVRsxmQqYZAnLpykkehTiJPFqJXcyGzoTlIOxLpMpLxWTUEuuyHbxVWxiyVOVkIiwLbbQHvLLLqKYuyxyShtBaXNThbZOHAPnlonxESVBfVbwnCRxyqCsMyIOxYZebvBhASZKBfYjYhYmJmqxYdVBPSwHdJukDvgkTPjUQdUxQizdTJpOUaPBHATVAovAYOPfRDaBahUdvYXwYQsgcHEQvxklaWSbqiAJIEpYoyrQJfVpAezHrewAqvbIXRxGbQWfJTwAsxFkGlfnMaFinEMBbcgtJWLEIFOYLMjBrzzgjPNlCUQMIobGDcUhyaYLTNlYYTiIfgeZjOcuPwWSPkrKINKGSUdhOymESajWNEJQgGvfQQoecDfPLUsuDaTNQZGfZDhrxAiXIdzQIWHIWqdSGdvKuHkbLTntAPxEPeRGYhBriYejXoGlKbEyGXDzPazUawUINGXifWMvhGVKXPoUdmjDqJkBwRJxrmZzEQxfwHlvxecUFyXjbdwtROUVtXTOgQyfHLXSBnoxOuSmJfZLXUvUJbTYLNUKFEdlPCFmYKwZDtHCCBvmlMWBqnLMngFmXAzXtLzoUVICUvXLzJvgDXXEjunHQysPonnUYbzNmEYpTbApFJlEXQUWZfVANXQNwNHpvNKrKKELBEElodxRaKFLgbhRoGXJYuYKgvroGPaMMQVOvTcIUKOxfrrVsbTUYIhCyKEbuX","passwordIterations":5000,"passwordLength":64,"secretSalt":"qsDFcyzRIDKmjHUsFterKfYOuSlrbpnEfpFzOZrvAArQoYqPpyHBYJSQOUudZttyQjBvBvfeqWVZVVYSTDFbdElTaKjUYFaXJGsqJRFtGXgKrseOjwtRcLqJutNHCeCcFtQmFDjaQZkLZOYhylCgdvsOhFRHkRVfbztDSIjgtwJxBuPtONUWOIZITRRsovqxRWADNhnqqMXZemeXKGDrmJhRVZYCRApAOnFEiIrRFfzoLteBWMKyKHVejxcTbkaxOLXiUcXnDFtmQaGFCEhqgmaaKStDByJrxxZjGAhaiQEwxDAfXrXlBSdkQHECWvyORBoaoougcyzJOzYDMWJfrMEvMnJFFSRbXKwiUMxTqeGNxKYNgqUFrcqJRmpYcdzIbyuveboqwhJVASisPywHzFHwdSEBUMmLBnuvQOuAKiQiLwlBpIviuxygTPkUjqTqxDUvUHqjCTERAWOHWZDljBFZApFgSzEQocrpRAvpxVujUxqslfegqsKcdNcPCvswSKJRlfPLUtmhoSCmHQFEfBDpKSqJCPrWmBKkejlUGyLsUUMyjJcrXDHUIpOSIhllghVMuEAviMVvlunYHmZPvTQjEsJUeNiymTYAqyrlhEktqRPAzffMWySzXZBwSXHqlAbZLuOOmBMBmDSTTFATqfohUGEWimVZArGiYXdEYnQXySFYUUjAHVniMihhrSRUMshKtyAwIolKkGqadjRkDcBtKHWwFAnqhQhEdFYaTfhVszKIIoSTOrmFxyfnhxyDVblnvzgbjuFyubPgIqEbtssMsvBXpIbcFQAmRRxSIboHMnvrcOQooidwaUJngxJZcpXpqJDlLOylgXZBRpIcDtilaZfcJhoZLYNdiWiOaawgchyAQGVMUTwkvKMTzhFMGrNlyAsnRmNGfQmiBwWpVRBDGaTJrkQHjdSDbeDKbpsuXCwHjrfXfzwUNAwxOwRWjgskheaWRALlDkxcWCGMLImgAHzPVaJPDYtleVWTOPVfpWLzTGyNJbgTfLchspXGwEKLzGGDHqUuHYiRWYqkuGjxkIBPfAgypKPdIxnrnGYxjiDlICogjEvAidElWQAuhXBYeCqAWoiOYjZpLzzWMMyMEUcbOagujvjgLevxsBCkUffrmPtHwNIzGdnLeidonTOVvWmlyxLWGFIQjWCBKQqVtJbOpjuCsTcwRkyqVbiNWdQJpwNFAJhBPEXqieeprulpQZfiPrFjIMBsYFLzJwHZDAuoIcSHUYZeOzSukMxBBraZEiDUPabIzoNyuZezZtsGeeGsCvijeoaAYQInGxCMVtBoXVJgJlbGyfOTxCfDdKrroadbXyvVEgyORqBSbFUktpFsgbBXSjHyqVTgZdmcdrmvrZOiZnnHWFKrNYUxmtTjCkhKsNqLCVDdUFrtrltBnnSoAALpVEEDTinMpihzubQPcqLkytNptxvDLngtsCxqFOSllIIxTMlTpaxZUmEWiTLoXFBvItClOwGkbaQrHhxZxOUSexEiIZyKPpKezUqugzrcBYPrFaQveNnltCAaZffDrCemwhuwtagZnCaaqXqBWESBNaTWoalhxkHwuDcYNQvpyaxESYvGjkgWYxXCZhwVMWqgbjCTokQxAEEemNaTarUSlKjLtKpHzoWQEieujbaKgGpsPIOhrnuGFcyJQpKFWsAKoBenqshqUkIRCXeyPUCIcPILMFijlyLMlnkvbGjhllwhGwtRexvhKUsoBBUzqPnWSxgzeOUNBKVkiAcjxcDDNIUhRnBdTYkOMVbgYThhRlSvHwsKuuyWuTIzDZfYCMXgAuwavoQpCLoprURsmUVTITCiMbvwCGFEmgebhOlTrDYEiIECXQSrtnMKRxuAucRUTctVtJyseJovflqoBtqHzBLblMEjSZOtDujUIeugoMExEvfoUZpMaKfECuVdsDxLErTtOQRLSOhAReSinPjkQWdyhEiZPNGYlHbxhPLTEOZlqnIDFrDZKlIdtTRjCBjsKSzJkanhCxOJHLLnxNKbeZnmDKbupUENarikMKYjUkoDUIKosSTV","secretIterations":5000,"secretLength":64}
 */
    bindWebService('/sky/id/salts', salts);
    bindWebService('/sky/id/create', skyIdCreate);
    bindWebService('/sky/id/commit', skyIdCommit);
    bindWebService('/sky/id/login', skyIdLogin);
})();
