/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2018 Eduworks Corporation and other contributing parties.
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
var $ = null;
var document = null;
var window = {};
var localStorage = {};

var setTimeout = function (f, time) {
    if (f != null)
        f();
}

console = {
    log: function (s) {
        debug(s);
    },

    error: function (s) {
        debug("error:" + s);
    }
};

load("classpath:stjs.js");
load("classpath:blobHelper.js");
load("classpath:formdata.js");
load("classpath:random.js");
load("classpath:ec.base.js");
load("classpath:forge/forge.min.js");
load("classpath:ec.crypto.js");
load("classpath:org.json-ld.js");
load("classpath:org.cassproject.schema.general.js");
load("classpath:org.schema.js");
load("classpath:org.w3.skos.js");
load("classpath:org.cassproject.schema.ebac.js");
load("classpath:org.cassproject.schema.cass.js");
load("classpath:ebac.identity.js");
load("classpath:ebac.repository.js");
load("classpath:cass.competency.js");
load("classpath:cass.rollup.js");

EcRepository.caching = true;
EcRemote.async = false;
EcIdentityManager.async = false;

var repo = new EcRepository();
repo.selectedServer = "http://localhost:8080/api/";

if (java.lang.System.getenv("CASS_LOOPBACK") != null)
    repo.selectedServer = java.lang.System.getenv("CASS_LOOPBACK")

if (java.lang.System.getenv("ELASTICSEARCH_ENDPOINT") != null)
    elasticEndpoint = java.lang.System.getenv("ELASTICSEARCH_ENDPOINT");

thisEndpoint = function () {
    return repo.selectedServer;
}
repoEndpoint = function () {
    return repo.selectedServer;
}

var keyFor = function (filename) {
    if (java.lang.System.getenv(filename) != null)
        return java.lang.System.getenv(filename);
    if (fileExists(filename + ".pem"))
        return fileToString(fileLoad(filename + ".pem", false, true));
    if (fileExists("etc/" + filename + ".pem"))
        return fileToString(fileLoad("etc/" + filename + ".pem", false, true));
    if (!fileExists("etc"))
        createDirectory("etc");
    fileSave(EcPpk.generateKey().toPem(), "etc/" + filename + ".pem");
    return fileToString(fileLoad("etc/" + filename + ".pem", false, true));
}

function repoAutoDetect() {
    if (java.lang.System.getenv("CASS_LOOPBACK") != null)
        repo.selectedServer = java.lang.System.getenv("CASS_LOOPBACK");
    else
        repo.autoDetectRepository();

    if (java.lang.System.getenv("ELASTICSEARCH_ENDPOINT") != null)
        elasticEndpoint = java.lang.System.getenv("ELASTICSEARCH_ENDPOINT");

    console.log("Loopback: " + repo.selectedServer);
    console.log("Elasticsearch Endpoint: " + elasticEndpoint);
    console.log("Text Encoding: " + java.lang.System.getProperty("file.encoding"));
    console.log("Text Encoding: " + java.nio.charset.Charset.defaultCharset().toString());
}