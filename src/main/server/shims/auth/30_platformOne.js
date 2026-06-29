module.exports = function (common) {
    if (process.env.CASS_PLATFORM_ONE_AUTH_ENABLED) {
        /**
         * Extract the encoded JWT from the request's provided Authorization header.
         * @param {String} authHeader 
         * @returns 
         */
        function parseHeader(authHeader) {
            if (!authHeader || !authHeader.startsWith("Bearer "))
                return null;

            let tokenStr = authHeader.slice(7);
            let parsed = parseJwt(tokenStr);

            return parsed;
        }

        /**
         * Parse the JWT's body string into a JSON object.
         * @param {String} tokenStr 
         * @returns 
         */
        function parseJwt(tokenStr) {
            let parts = tokenStr.split('.');
            let bodyEncodedB64 = parts[1];
            let bodyDecodedStr = Buffer.from(bodyEncodedB64, 'base64').toString();
            let bodyDecoded = JSON.parse(bodyDecodedStr);

            return bodyDecoded;
        }

        function interpretEnvFlag(envFlag) {
            return envFlag == "true";
        }

        function interpretEnvCSV(envCSV) {
            if (envCSV == undefined || typeof envCSV !== "string" || envCSV === "")
                return null;

            return envCSV.split(",");
        }

        /** @param {String} uuid */
        function numberFromUUID(uuid) {
            let hex = Buffer.from(uuid).toString("hex");
            return parseInt(hex, 16);
        }

        let adjectives = null;
        let nouns = null;

        function createAdjectiveFrom(uuid) {

            if (adjectives == null)
                adjectives = interpretEnvCSV(process.env.CASS_PLATFORM_ONE_AUTH_ADJECTIVES);

            if (adjectives != null && adjectives.length > 0) {
                let uuidNumber = numberFromUUID(uuid);
                let index = uuidNumber % adjectives.length;

                return adjectives[index];
            }

            return "Anonymous";
        }

        function createNounFrom(uuid) {

            if (nouns == null)
                nouns = interpretEnvCSV(process.env.CASS_PLATFORM_ONE_AUTH_NOUNS);

            if (nouns != null && nouns.length > 0) {
                let uuidNumber = numberFromUUID(uuid);
                let index = uuidNumber % nouns.length;

                return nouns[index];
            }

            return "User";
        }

        /**
         * Validate whether this token has the expectd Platform One properties.
         * @param {Object} token 
         * @returns 
         */
        function validateJwt(token) {

            if (token == null)
                return false;

            let checkIssuer = interpretEnvFlag(process.env.CASS_PLATFORM_ONE_AUTH_CHECK_ISSUER);
            if (checkIssuer) {
                let expectedIssuer = process.env.CASS_PLATFORM_ONE_ISSUER;
                let actualIssuer = token.iss;
                if (actualIssuer !== expectedIssuer)
                    return false;
            }

            let checkClient = interpretEnvFlag(process.env.CASS_PLATFORM_ONE_AUTH_CHECK_CLIENT);
            if (checkClient) {
                let expectedClient = process.env.CASS_PLATFORM_ONE_CLIENT;
                let actualClient = token.azp;
                if (actualClient !== expectedClient)
                    return false;
            }

            let ignoreIssueTime = interpretEnvFlag(process.env.CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME);
            if (!ignoreIssueTime) {
                if (token.iat == undefined)
                    return false;

                let secondsSinceEpoch = token.iat;
                if (secondsSinceEpoch * 1000 < new Date().getTime() + 20000)
                    return false;
            }

            let uuid = token.sub;
            if (typeof uuid !== "string" || uuid.length !== 36)
                return false;

            return true;
        }

        app.use((req, res, next) => {

            let authHeader = req.get("Authorization");
            let token = parseHeader(authHeader);

            let seemsValid = validateJwt(token);
            if (seemsValid) {
                let shouldAnonymize = interpretEnvFlag(process.env.CASS_PLATFORM_ONE_AUTH_ANONYMIZE_USERS);
                if (shouldAnonymize) {
                    let adjective = createAdjectiveFrom(token.sub);
                    let noun = createNounFrom(token.sub);

                    token.name = `${adjective} ${noun}`;
                    token.email = token.sub;
                }

                req.p1 = token;
            }

            next();
        });
    }
};
