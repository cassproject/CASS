var $ = null;
var document = null;
var window = {};
var localStorage = {};

load("classpath:stjs.js");
load("classpath:blobHelper.js");
load("classpath:formdata.js");
print("classpath:random.js");
load("classpath:random.js");
print("classpath:ec.base.js");
load("classpath:ec.base.js");
print("classpath:forge/forge.min.js");
load("classpath:forge/forge.min.js");
print("classpath:ec.crypto.js");
load("classpath:ec.crypto.js");
print("classpath:org.json-ld.js");
load("classpath:org.json-ld.js");
print("classpath:org.cassproject.schema.general.js");
load("classpath:org.cassproject.schema.general.js");
print("classpath:org.schema.js");
load("classpath:org.schema.js");
print("classpath:org.cassproject.schema.ebac.js");
load("classpath:org.cassproject.schema.ebac.js");
print("classpath:org.cassproject.schema.cass.js");
load("classpath:org.cassproject.schema.cass.js");
print("classpath:ebac.identity.js");
load("classpath:ebac.identity.js");
print("classpath:ebac.repository.js");
load("classpath:ebac.repository.js");
print("classpath:cass.competency.js");
load("classpath:cass.competency.js");
print("classpath:cass.rollup.js");
load("classpath:cass.rollup.js");

EcRepository.caching = true;
EcRemote.async = false;
EcIdentityManager.async = false;

console = {};
console.log = function(s){print(s);}