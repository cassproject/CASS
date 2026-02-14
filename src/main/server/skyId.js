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

const fs = require('fs');
const nodePath = require('path');
const { skyrepoGetInternal } = require('./skyRepo/get');
const { skyrepoPutParsed } = require('./skyRepo/put');
let usernameSalt = null;
let passwordSalt = null;
let secretSalt = null;
let skyIdSalt = null;
let skyIdSecretStr = null;
global.skyIdSecret = function () {
    return skyIdSecretStr;
};
let skyIdSecretKey = null;
let skyIdPem = null;
let cachedSalts = {};
let salts = function () {
    return JSON.stringify(cachedSalts);
};
let skyIdCreate = async function () {
    let { username: id, password, credentials } = JSON.parse(fileToString((fileFromDatastream).call(this, 'credentialCommit', null))) || {};

    if (!id) error('Missing username.', 422);
    if (!password) error('Missing password.', 422);

    let saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    let saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    let payload = { ...credentials, password: saltedPassword };

    let signatureSheet = [await EcIdentityManager.default.createSignature(60000, null, skyIdPem)];
    this.ctx.put('signatureSheet', signatureSheet);

    let existingAccount = await (skyrepoGetInternal).call(this, saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue', null);
    if (existingAccount) error('Cannot create, account already exists.', 422);

    let encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(payload), skyIdSecretKey, saltedId);

    await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue');
    return null;
};
let skyIdCommit = async function () {
    let searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, 'credentialCommit', null))) || {};
    let { username: id, password, token, credentials } = searchParams;

    if (!id) error('Missing username.', 422);
    if (!password) error('Missing password.', 422);
    if (!token) error('Missing token.', 422);

    let saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    let saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));

    let payload = { ...credentials, token, password: saltedPassword };
    let encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(payload), skyIdSecretKey, saltedId);

    let signatureSheet = [await EcIdentityManager.default.createSignature(60000, null, skyIdPem)];
    this.ctx.put('signatureSheet', signatureSheet);

    let get = await (skyrepoGetInternal).call(this, saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue', null);
    if (!get) error('User does not exist.', 404);

    get = JSON.parse(await EcAesCtrAsync.decrypt(get.payload, skyIdSecretKey, saltedId));
    if (get.token !== token) error('An error in synchronization has occurred. Please re-login and try again.', 403);

    await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue');
    return null;
};
let skyIdLogin = async function () {
    let { username: id, password } = JSON.parse(fileToString((fileFromDatastream).call(this, 'credentialRequest', null))) || {};

    if (!id) error('Missing username.', 422);
    if (!password) error('Missing password.', 422);

    let saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    let saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));

    let signatureSheet = [await EcIdentityManager.default.createSignature(60000, null, skyIdPem)];
    this.ctx.put('signatureSheet', signatureSheet);

    let get = await (skyrepoGetInternal).call(this, saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue', null);
    if (!get) error('User does not exist.', 404);

    get = JSON.parse(await EcAesCtrAsync.decrypt(get.payload, skyIdSecretKey, saltedId));
    if (get.password !== saltedPassword) error('Invalid password.', 403);

    get.token = randomString(20);
    let lastLogin = get.lastLogin || Date.now();
    get.lastLogin = Date.now();

    let encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(get), skyIdSecretKey, saltedId);

    await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, 'schema.cassproject.org.kbac.0.2.EncryptedValue');

    delete get.password;
    get.lastLogin = lastLogin;

    return JSON.stringify(get);
};
global.loadConfigurationFile = function (path, dflt) {
    global.pathCheck(path);
    const ensureDirectoryExists = (dirPath) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    };

    ensureDirectoryExists('etc');
    const fullPath = `etc/${path}`;
    ensureDirectoryExists(fullPath.substring(0, fullPath.lastIndexOf('/')));

    if (fs.existsSync(path)) {
        return fileToString(fileLoad(path));
    }
    if (fs.existsSync(fullPath)) {
        return fileToString(fileLoad(fullPath));
    }
    if (dflt == null) {
        return null;
    }
    const def = dflt();
    if (def != null) {
        fileSave(def, fullPath);
    } else {
        return null;
    }
    return fileToString(fileLoad(fullPath));
};
(() => {
    const generateSaltConfig = (key, iterations, length) => {
        const salt = loadConfigurationFile(`skyId.${key}.public.salt`, () => randomString(2048));
        cachedSalts[`${key}Salt`] = salt;
        cachedSalts[`${key}Iterations`] = iterations;
        cachedSalts[`${key}Length`] = length;
        return salt;
    };

    usernameSalt = generateSaltConfig('username', 5000, 64);
    passwordSalt = generateSaltConfig('password', 5000, 64);
    secretSalt = generateSaltConfig('secret', 5000, 64);

    skyIdSalt = loadConfigurationFile('skyId.salt', () => randomString(2048));
    skyIdSecretStr = loadConfigurationFile('skyId.secret', () => randomString(2048));
    skyIdSecretKey = forge.util.encode64(forge.pkcs5.pbkdf2(skyIdSecretStr, skyIdSalt, 10000, 16));
    skyIdPem = EcPpk.fromPem(loadConfigurationFile('skyId.pem', () => EcPpk.fromPem(rsaGenerate()).toPem()));

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
     *               example: {"usernameSalt":"exampleSalt","usernameIterations":5000,"usernameLength":64,"passwordSalt":"exampleSalt","passwordIterations":5000,"passwordLength":64,"secretSalt":"exampleSalt","secretIterations":5000,"secretLength":64}
     */
    bindWebService('/sky/id/salts', salts);

    /**
     * @openapi
     * /api/sky/id/create:
     *   post:
     *     tags:
     *       - Basic Keystore
     *     summary: Create a new user identity
     *     description: |
     *       Creates a new SkyID user account. The client must first fetch salts from
     *       `/api/sky/id/salts`, hash the username and password with PBKDF2 on the client side,
     *       then send the hashed credentials along with the encrypted keystore (PPK, etc.)
     *       in the `credentialCommit` form field. Returns null on success.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               credentialCommit:
     *                 type: string
     *                 description: JSON string containing `username`, `password`, and `credentials` (the encrypted keystore payload).
     *     responses:
     *       200:
     *         description: Account created successfully (returns null).
     *       422:
     *         description: Missing username or password, or account already exists.
     */
    bindWebService('/sky/id/create', skyIdCreate);

    /**
     * @openapi
     * /api/sky/id/commit:
     *   post:
     *     tags:
     *       - Basic Keystore
     *     summary: Update an existing user identity
     *     description: |
     *       Commits (updates) the encrypted keystore for an existing SkyID account.
     *       Requires a valid synchronization `token` obtained from a prior login.
     *       The token prevents concurrent overwrites.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               credentialCommit:
     *                 type: string
     *                 description: JSON string containing `username`, `password`, `token`, and `credentials`.
     *     responses:
     *       200:
     *         description: Account updated successfully (returns null).
     *       403:
     *         description: Synchronization token mismatch — re-login and try again.
     *       404:
     *         description: User does not exist.
     *       422:
     *         description: Missing username, password, or token.
     */
    bindWebService('/sky/id/commit', skyIdCommit);

    /**
     * @openapi
     * /api/sky/id/login:
     *   post:
     *     tags:
     *       - Basic Keystore
     *     summary: Log in and retrieve the encrypted keystore
     *     description: |
     *       Authenticates with a hashed username and password, then returns the
     *       encrypted keystore credentials along with a new synchronization token
     *       for subsequent commits.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               credentialRequest:
     *                 type: string
     *                 description: JSON string containing `username` and `password`.
     *     responses:
     *       200:
     *         description: Login successful.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               description: The decrypted credential payload (minus the password) with a new token and lastLogin timestamp.
     *       403:
     *         description: Invalid password.
     *       404:
     *         description: User does not exist.
     *       422:
     *         description: Missing username or password.
     */
    bindWebService('/sky/id/login', skyIdLogin);
})();
