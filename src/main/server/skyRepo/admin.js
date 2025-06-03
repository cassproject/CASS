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

const skyrepoAdminPk = global.skyrepoAdminPk = function () {
    return EcPpk.fromPem(keyFor("skyAdmin2")).toPk().toPem();
};

const skyrepoAdminList = global.skyrepoAdminList = function () {
    const array = [skyrepoAdminPk()];

    let mayHaveUserAdmins = process.env.AUTH_ALLOW_ENV_ADMINS == "true";
    if (mayHaveUserAdmins) {
        let knownAdminPks = sharedAdminCache.getKnownUserAdminPks();
        for (let userPk of knownAdminPks) {
            array.push(userPk);
        }
    }

    return array;
};

const endpointAdmin = function () {
    return JSON.stringify(skyrepoAdminList());
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

return module.exports = {
    skyrepoAdminPk,
    skyrepoAdminList,
    // endpointAdmin
};