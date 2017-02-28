var profileX = false;
if (profileX)
    console.log("init:" + new Date().getTime() % 100000);
var fs = require('fs');
require("node-jquery-xhr");
var forge = require("node-forge");
var FormData = require('form-data');
var antlr4 = require('antlr4/index');
var Worker = require('webworker-threads').Worker;
if (profileX)
    console.log("reqs:" + new Date().getTime() % 100000);

var window = {};
window.scriptPath = "";
var document = {};
var view = {};
var localStorage = {};

eval(fs.readFileSync("../../src/main/js/cass/random.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/blobHelper.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/stjs.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/ec.base.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/ec.crypto.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.json-ld.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.general.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.schema.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.ebac.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.cass.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/ebac.identity.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/ebac.repository.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/cass.competency.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/RollupListener.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/RollupParser.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/RollupLexer.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/cass.rollup.js") + "");
if (profileX)
    console.log("libs:" + new Date().getTime() % 100000);

if (fs.existsSync("decryptionCache.json"))
    EcCrypto.decryptionCache = JSON.parse(fs.readFileSync("decryptionCache.json"));
if (fs.existsSync("decryptionCacheFailure.json"))
    EcCrypto.decryptionCacheFailure = JSON.parse(fs.readFileSync("decryptionCacheFailure.json"));
if (fs.existsSync("repo.json"))
    EcRepository.cache = JSON.parse(fs.readFileSync("repo.json"));
for (var v in EcRepository.cache)
{
    var c = new EcRemoteLinkedData();
    c.copyFrom(EcRepository.cache[v]);
    EcRepository.cache[v] = c;
}
//console.log(EcCrypto.decryptionCache);
//console.log(EcRepository.cache);

if (profileX)
    console.log("cach:" + new Date().getTime() % 100000);

var frameworkId = null;
var ppk = null;
var pk = null;
var endpoint = null;

process.argv.forEach(function (val, index, array)
{
    if (val.split("=")[0] == "debug")
    {
        frameworkId = "https://cass.tla.cassproject.org/api/custom/data/schema.cassproject.org.0.2.Framework/012e77e0-3a47-4b24-bb12-370a76ac2adc";
        pk = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo5eMsEpmhyyJ25DGHHl664YVma9Q5EPNRpB7gKHDhq4FG4CeUwj5c2S7YM+KN1r4NYe6ZpO/BjxzuT3vlebX7IHRzjYmQBo7T1yEYUHMDwKkw3PP1GLwURKqHofmnpbXWFrU1HWHgFLLH53YvKIHYE2KsImFB4zO9sNh1fO9ZyiCRh1EAcXA3QMCUPfOZuZRGA3QaemS8kIu0dKEgcA0pcKFzk8w2psm38kF66YSKZdeIWHjfAh7eZv7F+lC2qv9Y+WOCOfXLDW60EcxLR14jEvrc8uGoeSg1Uy/zdlQQfJEoDMUAcuDt4qldFvs1U2M0sePMuTZysEWs7U2Des61wIDAQAB-----END PUBLIC KEY-----";
        pk = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAosPK4X3xDxVjD8KizliAh4xAf4Z+9ek8yCrPSspJqv5CoO1VBxeqGOtSMuf5Q8k9BaJoMIQKxn8+CWqlXvZuqrbgpn7MckQmKEGsugqfRSg8/uyTstOiOPlgX7XSGg2ZbBJ7jdhv4dDLYeZfht5gjIWsHnHIay2u6SIRokhaLkblS7m8FelSj7UX4qzWzOhGta8IBPkJERBjQE3H+YMoH/ns4GcKJ7mP4mQWAX47cHDxN58aoiwaQsJdp8TeKsP0uGqhgH3PYL9rCOx44QBaGmHZ5qqdt8tNjMVINuGFMqjVQFbc6lZbEG+w1W7er4mvzo8YAD4pKeoRzGkY2e1x/QIDAQAB-----END PUBLIC KEY-----";
        ppk = "-----BEGIN RSA PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCB5hI5AOgWFziOC4PO2y+dutdOazLDWPUnPrG68mMLJtrCAqkdCMZpCaD0H3n88PnQhTTl4SGYQxHPnwvSHTaB62Bs6EuNf72h4VtC6R2p29+U9ouOExhwiEwgiKlxozRVVFD8ywgnFnwiqJd50KgaPyaizKm5/bEfstto4FWQoD+kc9636IOttP3BYKFSe+RfoCbSvTbUdXeVxdfN+cNdEHe/7MMv4esAg4mfvtq82ba7EYzX/Lzxk3Hk61rHi2+4HW6Dajk7X9GVQ+ccgqfePBY/BpAZSfmmmMhN+o6iqOGqRoUBYstch22RQbcTRxoh7fYjUWiuzLP4AZrPD4P5AgMBAAECggEABWIUtBPiH6o82oFxJ//O2xqXWhquAEjzOI9hUQCYU1RmoT7NeynLg9EAQHr+dJmYQgiHKZX5F6+DMTION29PpzYrKTro3fdi0y7SN/VjreVHVcvFevDhJNFigEBRmfyRX7jjtfou/2RakXAgU44ZV/nGft18P3wwhy0Dvov6F8kbtISOkeo34Mshq7BOUSL/q4DUBnafPikhCVzlxTiJFUX+upkzUQiQs/J63dLntnGvQzqEPWetaGXL6bJH0DmXSyJnjATFTdhIShRxqPiHCTc7j2dn6uoqJN6KP3XzGzF0IFokDkOChc+xS8gXjV9n0gytrkydSrtdNtsThjzjpQKBgQDRn1m0EMx9IJ8VFuNRlFLhijCOR8VtAieZ7JPjmoGZYcFahgekXSPzf6xAVmUC6j2UlDtCkZwkexRQKLeA+j1Qy0dQd26B5YPhwANsf71ZDgiilI4CIKJqKPUc6InJzZo2P9DRFSmivUyLAOaoClC/crilEn/GDtGTwKLWPjy1fQKBgQCeo06lHSBNbtHTYV7DXWuppA1aAX4mq+naoTJ5uUPWVDgvdt8illVFDcfKVIC+vYt4JdY06rnYXxHVJHVgLPy57cSni/cRKUw96IWGVQWXiu84saVKHSAEptY4fIXygst61fHr5+2lU/elAdqxhH4v4RhTcqXT28AHylD+ZUChLQKBgH0TV7LZUypWDJXI0loa5lks20wKBwLEBl0RjCyCRFIAwh4BWw33hTwFMgIxipPysEu3JqTRvRkHV1d89AFBTtSmdibNHGLlT4ujxmc20QQSG5TmjtU2I7K0PYzCM3T1+M3lxfL7bZxs1v8Zyob5oLSa/xF/uD21GdfPWVn8SL0BAoGATWXyDf8K7pyeBRrhqEHhMHBZD0vhJ68Ctuek/9yTK3QFwaqmrXJZggp6Ks5VzjoeXO1g+Ip5SAcCZVKXbeglGfXW18QjNB1JFH9o/iRnSQvBMZECywkwwPRBWmfu1mZYLsNJeEa9HMe98KTZ9XhmNKgHPVeXbqktpN9h6uytvrUCgYEAo2+5+BKVsC/Zdw/eOWu6D/OfujOVCnot7a5eIsz4VkjcJucO8EH3L9Mdx0cDBVtnqN84wnptp9t7ADLtrFHiZcZ+uVvZjFASi6krQ2fPs2sUISiGBHRFq7Bq1i+uyWw8uH1Z2zlUMuv2lqS8kdh3rcDgLT1tqdiySfnipbplOHE=-----END RSA PRIVATE KEY-----";
        endpoint = "https://cass.tla.cassproject.org/api/custom/";
    }
    if (val.split("=")[0] == "frameworkId")
        frameworkId = val.split("=")[1];
    if (val.split("=")[0] == "ppk")
        ppk = val.replace("ppk=", "");
    if (val.split("=")[0] == "pk")
        pk = val.replace("pk=", "");
    if (val.split("=")[0] == "endpoint")
        endpoint = val.replace("endpoint=", "");
});
var debug = false;
if (debug)
    console.log("frameworkId:" + frameworkId);
if (debug)
    console.log("ppk:" + ppk);
if (debug)
    console.log("pk:" + pk);
if (debug)
    console.log("endpoint:" + endpoint);
if (frameworkId == null)
{
    console.log("Framework ID is missing.");
    process.exit(1);
}
if (ppk == null)
{
    console.log("PPK is missing.");
    process.exit(1);
}
if (pk == null)
{
    console.log("PK is missing.");
    process.exit(1);
}
if (endpoint == null)
{
    console.log("Endpoint is missing.");
    process.exit(1);
}

var error = function (data)
{
    if (debug)
        console.log(data);
    console.log("error");
    process.exit();
};

var repo = new EcRepository();
repo.selectedServer = endpoint;
EcRepository.caching = true;
EcCrypto.caching = true;
EcRepository.cachingSearch = true;
if (debug)
    console.log("Remote server: " + repo.selectedServer);

var remoteIdentityManager = new EcRemoteIdentityManager();
remoteIdentityManager.server = repo.selectedServer;

var identity = new EcIdentity();
identity.ppk = EcPpk.fromPem(ppk);
identity.displayName = "Person";
EcIdentityManager.addIdentity(identity);

if (EcIdentityManager.ids.length > 0)
    identity = EcIdentityManager.ids[0];
var counter = 0;
var target = EcPk.fromPem(pk);
var profile = {};
if (debug)
    console.log("Fetching framework.");
EcIdentityManager.signatureSheetCaching = true;
if (profileX)
    console.log("redy:" + new Date().getTime() % 100000);

EcFramework.get(
        frameworkId,
        function (framework)
        {
            if (profileX)
                console.log("frmw:" + new Date().getTime() % 100000);

            //repo.precache(framework.competency.concat(framework.relation),function(success){
            counter = framework.competency.length;
            if (profileX)
                console.log("prec:" + new Date().getTime() % 100000);
            for (var i = 0; i < framework.competency.length; i++)
            {
                var competencyId = framework.competency[i];
                if (debug)
                    console.log("Fetching: " + competencyId);

                EcCompetency.get(
                        competencyId,
                        function (competency)
                        {
                            if (debug)
                                console.log("Processing assertions.");
                            var ep = new PessimisticQuadnaryAssertionProcessor();
                            ep.profileMode = true;
                            ep.logFunction = function (data)
                            {
                                if (debug)
                                    console.log(data);
                            };
                            ep.repositories.push(repo);
                            var subject = new Array();
                            subject.push(target);
                            var additionalSignatures = null;
                            ep.has(
                                    subject,
                                    competency,
                                    null,
                                    framework,
                                    additionalSignatures,
                                    function (data)
                                    {
                                        counter--;
                                        profile[data.competency[0].id] = data.result._name;
                                        if (debug)
                                            console.log(profile);
                                        if (counter == 0)
                                        {
                                            console.log(profile);
                                            fs.writeFileSync("decryptionCache.json", JSON.stringify(EcCrypto.decryptionCache));
                                            fs.writeFileSync("decryptionCacheFailure.json", JSON.stringify(EcCrypto.decryptionCacheFailure));
                                            for (var v in EcRepository.cache)
                                            {
                                                if (EcArray.isArray(EcRepository.cache[v]))
                                                    delete EcRepository.cache[v];
                                                else
                                                    EcRepository.cache[v] = JSON.parse(EcRepository.cache[v].toJson());
                                            }
                                            fs.writeFileSync("repo.json", JSON.stringify(EcRepository.cache));
                                            if (profileX)
                                                console.log("done:" + new Date().getTime() % 100000);

                                            process.exit();
                                        }
                                    },
                                    error,
                                    error
                                    );
                        }
                );
            }
            //});
        }, error
        );
