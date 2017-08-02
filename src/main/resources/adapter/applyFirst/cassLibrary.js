var $ = null;
var document = null;
var window = {};
var localStorage = {};

var directory = "webapps/cass/";
// For Local Development
//var directory = "src/main/webapp/";

load(directory+"cass.example/js/cass/stjs.js");
load(directory+"cass.example/js/cass/blobHelper.js");
load("classpath:formdata.js");
print(directory+"cass.example/js/cass/random.js");
load(directory+"cass.example/js/cass/random.js");
print(directory+"cass.example/js/cass/ec.base.js");
load(directory+"cass.example/js/cass/ec.base.js");
print(directory+"cass.example/forge/forge.min.js");
load(directory+"cass.example/forge/forge.min.js");
print(directory+"cass.example/js/cass/ec.crypto.js");
load(directory+"cass.example/js/cass/ec.crypto.js");
print(directory+"cass.example/js/cass/org.json-ld.js");
load(directory+"cass.example/js/cass/org.json-ld.js");
print(directory+"cass.example/js/cass/org.cassproject.schema.general.js");
load(directory+"cass.example/js/cass/org.cassproject.schema.general.js");
print(directory+"cass.example/js/cass/org.schema.js");
load(directory+"cass.example/js/cass/org.schema.js");
print(directory+"cass.example/js/cass/org.cassproject.schema.ebac.js");
load(directory+"cass.example/js/cass/org.cassproject.schema.ebac.js");
print(directory+"cass.example/js/cass/org.cassproject.schema.cass.js");
load(directory+"cass.example/js/cass/org.cassproject.schema.cass.js");
print(directory+"cass.example/js/cass/ebac.identity.js");
load(directory+"cass.example/js/cass/ebac.identity.js");
print(directory+"cass.example/js/cass/ebac.repository.js");
load(directory+"cass.example/js/cass/ebac.repository.js");
print(directory+"cass.example/js/cass/cass.competency.js");
load(directory+"cass.example/js/cass/cass.competency.js");
print(directory+"cass.example/js/cass/cass.rollup.js");
load(directory+"cass.example/js/cass/cass.rollup.js");

EcRepository.caching = true;
EcRemote.async = false;
EcIdentityManager.async = false;