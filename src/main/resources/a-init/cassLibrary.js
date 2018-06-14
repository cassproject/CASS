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
print("classpath:org.w3.skos.js");
load("classpath:org.w3.skos.js");
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

console = {
    log: function (s) {
        print(s);
    }
};
