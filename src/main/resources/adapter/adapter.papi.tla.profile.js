var error = function (data)
{
    print(data);
};

var $ = null;
var document = null;
var window = {};
var localStorage = {};

load("classpath:/../../cass.example/js/cass/stjs.js");
load("classpath:/../../cass.example/js/cass/blobHelper.js");
load("classpath:formdata.js");
print("classpath:/../../cass.example/js/cass/random.js");
load("classpath:/../../cass.example/js/cass/random.js");
print("classpath:/../../cass.example/js/cass/ec.base.js");
load("classpath:/../../cass.example/js/cass/ec.base.js");
print("classpath:/../../cass.example/forge/forge.min.js");
load("classpath:/../../cass.example/forge/forge.min.js");
print("classpath:/../../cass.example/js/cass/ec.crypto.js");
load("classpath:/../../cass.example/js/cass/ec.crypto.js");
print("classpath:/../../cass.example/js/cass/org.json-ld.js");
load("classpath:/../../cass.example/js/cass/org.json-ld.js");
print("classpath:/../../cass.example/js/cass/org.cassproject.schema.general.js");
load("classpath:/../../cass.example/js/cass/org.cassproject.schema.general.js");
print("classpath:/../../cass.example/js/cass/org.schema.js");
load("classpath:/../../cass.example/js/cass/org.schema.js");
print("classpath:/../../cass.example/js/cass/org.cassproject.schema.ebac.js");
load("classpath:/../../cass.example/js/cass/org.cassproject.schema.ebac.js");
print("classpath:/../../cass.example/js/cass/org.cassproject.schema.cass.js");
load("classpath:/../../cass.example/js/cass/org.cassproject.schema.cass.js");
print("classpath:/../../cass.example/js/cass/ebac.identity.js");
load("classpath:/../../cass.example/js/cass/ebac.identity.js");
print("classpath:/../../cass.example/js/cass/ebac.repository.js");
load("classpath:/../../cass.example/js/cass/ebac.repository.js");
print("classpath:/../../cass.example/js/cass/cass.competency.js");
load("classpath:/../../cass.example/js/cass/cass.competency.js");
print("classpath:/../../cass.example/js/cass/cass.rollup.js");
load("classpath:/../../cass.example/js/cass/cass.rollup.js");

EcRemote.async = false;
EcIdentityManager.async = false;
EcRepository.caching = true;
EcCrypto.caching = true;
EcRepository.cachingSearch = true;
EcIdentityManager.signatureSheetCaching = true;

var ppk = "-----BEGIN RSA PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCB5hI5AOgWFziOC4PO2y+dutdOazLDWPUnPrG68mMLJtrCAqkdCMZpCaD0H3n88PnQhTTl4SGYQxHPnwvSHTaB62Bs6EuNf72h4VtC6R2p29+U9ouOExhwiEwgiKlxozRVVFD8ywgnFnwiqJd50KgaPyaizKm5/bEfstto4FWQoD+kc9636IOttP3BYKFSe+RfoCbSvTbUdXeVxdfN+cNdEHe/7MMv4esAg4mfvtq82ba7EYzX/Lzxk3Hk61rHi2+4HW6Dajk7X9GVQ+ccgqfePBY/BpAZSfmmmMhN+o6iqOGqRoUBYstch22RQbcTRxoh7fYjUWiuzLP4AZrPD4P5AgMBAAECggEABWIUtBPiH6o82oFxJ//O2xqXWhquAEjzOI9hUQCYU1RmoT7NeynLg9EAQHr+dJmYQgiHKZX5F6+DMTION29PpzYrKTro3fdi0y7SN/VjreVHVcvFevDhJNFigEBRmfyRX7jjtfou/2RakXAgU44ZV/nGft18P3wwhy0Dvov6F8kbtISOkeo34Mshq7BOUSL/q4DUBnafPikhCVzlxTiJFUX+upkzUQiQs/J63dLntnGvQzqEPWetaGXL6bJH0DmXSyJnjATFTdhIShRxqPiHCTc7j2dn6uoqJN6KP3XzGzF0IFokDkOChc+xS8gXjV9n0gytrkydSrtdNtsThjzjpQKBgQDRn1m0EMx9IJ8VFuNRlFLhijCOR8VtAieZ7JPjmoGZYcFahgekXSPzf6xAVmUC6j2UlDtCkZwkexRQKLeA+j1Qy0dQd26B5YPhwANsf71ZDgiilI4CIKJqKPUc6InJzZo2P9DRFSmivUyLAOaoClC/crilEn/GDtGTwKLWPjy1fQKBgQCeo06lHSBNbtHTYV7DXWuppA1aAX4mq+naoTJ5uUPWVDgvdt8illVFDcfKVIC+vYt4JdY06rnYXxHVJHVgLPy57cSni/cRKUw96IWGVQWXiu84saVKHSAEptY4fIXygst61fHr5+2lU/elAdqxhH4v4RhTcqXT28AHylD+ZUChLQKBgH0TV7LZUypWDJXI0loa5lks20wKBwLEBl0RjCyCRFIAwh4BWw33hTwFMgIxipPysEu3JqTRvRkHV1d89AFBTtSmdibNHGLlT4ujxmc20QQSG5TmjtU2I7K0PYzCM3T1+M3lxfL7bZxs1v8Zyob5oLSa/xF/uD21GdfPWVn8SL0BAoGATWXyDf8K7pyeBRrhqEHhMHBZD0vhJ68Ctuek/9yTK3QFwaqmrXJZggp6Ks5VzjoeXO1g+Ip5SAcCZVKXbeglGfXW18QjNB1JFH9o/iRnSQvBMZECywkwwPRBWmfu1mZYLsNJeEa9HMe98KTZ9XhmNKgHPVeXbqktpN9h6uytvrUCgYEAo2+5+BKVsC/Zdw/eOWu6D/OfujOVCnot7a5eIsz4VkjcJucO8EH3L9Mdx0cDBVtnqN84wnptp9t7ADLtrFHiZcZ+uVvZjFASi6krQ2fPs2sUISiGBHRFq7Bq1i+uyWw8uH1Z2zlUMuv2lqS8kdh3rcDgLT1tqdiySfnipbplOHE=-----END RSA PRIVATE KEY-----";
var identity = new EcIdentity();
identity.ppk = EcPpk.fromPem(ppk);
identity.displayName = "Person";
EcIdentityManager.addIdentity(identity);

function getProfile()
{
    var me = this;
    if (me.params.debug || me.params.debug == "true")
    {
        me.params.frameworkId = "https://cass.tla.cassproject.org/api/custom/data/schema.cassproject.org.0.2.Framework/012e77e0-3a47-4b24-bb12-370a76ac2adc";
        me.params.pk = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo5eMsEpmhyyJ25DGHHl664YVma9Q5EPNRpB7gKHDhq4FG4CeUwj5c2S7YM+KN1r4NYe6ZpO/BjxzuT3vlebX7IHRzjYmQBo7T1yEYUHMDwKkw3PP1GLwURKqHofmnpbXWFrU1HWHgFLLH53YvKIHYE2KsImFB4zO9sNh1fO9ZyiCRh1EAcXA3QMCUPfOZuZRGA3QaemS8kIu0dKEgcA0pcKFzk8w2psm38kF66YSKZdeIWHjfAh7eZv7F+lC2qv9Y+WOCOfXLDW60EcxLR14jEvrc8uGoeSg1Uy/zdlQQfJEoDMUAcuDt4qldFvs1U2M0sePMuTZysEWs7U2Des61wIDAQAB-----END PUBLIC KEY-----";
        me.params.pk = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAosPK4X3xDxVjD8KizliAh4xAf4Z+9ek8yCrPSspJqv5CoO1VBxeqGOtSMuf5Q8k9BaJoMIQKxn8+CWqlXvZuqrbgpn7MckQmKEGsugqfRSg8/uyTstOiOPlgX7XSGg2ZbBJ7jdhv4dDLYeZfht5gjIWsHnHIay2u6SIRokhaLkblS7m8FelSj7UX4qzWzOhGta8IBPkJERBjQE3H+YMoH/ns4GcKJ7mP4mQWAX47cHDxN58aoiwaQsJdp8TeKsP0uGqhgH3PYL9rCOx44QBaGmHZ5qqdt8tNjMVINuGFMqjVQFbc6lZbEG+w1W7er4mvzo8YAD4pKeoRzGkY2e1x/QIDAQAB-----END PUBLIC KEY-----";
        me.params.endpoint = "https://cass.tla.cassproject.org/api/custom/";
    }
    if (me.params.frameworkId == null)
        throw "Framework not specified.";
    if (me.params.pk == null)
        throw "Target not specified.";
    if (me.params.endpoint == null)
        throw "Endpoint not specified.";

    me.repo = new EcRepository();
    me.repo.selectedServer = me.params.endpoint;
    me.frameworkId = me.params.frameworkId;
    me.endpoint = me.params.endpoint;

    me.result = null;
    me.counter = 0;
    me.target = EcPk.fromPem(me.params.pk);
    me.profile = {};
    EcFramework.get(
            me.frameworkId,
            function (framework)
            {
                me.counter = framework.competency.length;
                var ary = [];
                for (var i = 0; i < framework.competency.length; i++)
                    ary.push(framework.competency[i]);
                for (var i = 0; i < framework.relation.length; i++)
                    ary.push(framework.relation[i]);
                me.repo.precache(ary, function (success)
                {
                    for (var i = 0; i < framework.competency.length; i++)
                    {
                        var competencyId = framework.competency[i];
                        EcCompetency.get(
                                competencyId,
                                function (competency)
                                {
                                    var ep = new PessimisticQuadnaryAssertionProcessor();
                                    ep.profileMode = true;
                                    ep.logFunction = function (data)
                                    {
                                        //print(data);
                                    };
                                    ep.repositories.push(me.repo);
                                    ep.has(
                                            [me.target],
                                            competency,
                                            null,
                                            framework,
                                            null,
                                            function (data)
                                            {
                                                me.counter--;
                                                me.profile[data.competency[0].id] = data.result._name;
                                                if (me.counter == 0)
                                                {
                                                    me.result = me.profile;
                                                }
                                            },
                                            error,
                                            error
                                            );
                                }
                        );
                    }
                });
            }, error
            );
    for (var v in EcRepository.cache)
    {
        if (v.indexOf(me.params.pk) != -1)
        {
            delete EcRepository.cache[v];
        }
    }
    return me.result;
}
bindWebService("/tla/profile", getProfile);

function clearCaches()
{
    EcRepository.cache = {};
    EcCrypto.cache = {};
    EcIdentityManager.signatureSheetCache = {};
}
bindWebService("/tla/clearCaches", clearCaches);