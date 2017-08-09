/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
try {
    importScripts('forge.min.js');
} catch (ex) {}
try {
    importScripts('forge/forge.min.js');
} catch (ex) {}
try {
    importScripts('../forge/forge.min.js');
} catch (ex) {}
try {
    importScripts('../../forge/forge.min.js');
} catch (ex) {}
try {
    importScripts('../../../forge/forge.min.js');
} catch (ex) {}

self.addEventListener('message', function (e) {
    var data = e.data;
    try {
        switch (data.cmd) {
            case 'encryptRsaOaep':
                self.postMessage({
                    result: forge.util.encode64(forge.pki.publicKeyFromPem(data.pk)
                        .encrypt(data.text, "RSA-OAEP"))
                });
                break;
            case 'decryptRsaOaep':
                self.postMessage({
                    result: forge.pki.privateKeyFromPem(data.ppk).decrypt(
                        forge.util.decode64(data.text), "RSA-OAEP")
                });
                break;
            case 'signRsaOaep':
                var s = forge.sha1.create();
                s.update(data.text, "utf8");
                self.postMessage({
                    result: forge.util.encode64(forge.pki.privateKeyFromPem(data.ppk)
                        .sign(s))
                });
                break;
            case 'signSha256RsaOaep':
                var s = forge.sha256.create();
                s.update(data.text, "utf8");
                self.postMessage({
                    result: forge.util.encode64(forge.pki.privateKeyFromPem(data.ppk)
                        .sign(s))
                });
                break;
            case 'verifyRsaOaep':
                var s = forge.sha1.create();
                s.update(data.text, "utf8");
                self.postMessage({
                    result: forge.pki.publicKeyFromPem(data.pk)
                        .verify(s.digest().bytes(),
                            forge.util.decode64(data.signature))
                });
                break;
            case 'encryptAesCtr':
                var c = forge.cipher.createCipher("AES-CTR", forge.util
                    .decode64(data.secret));
                c.start({
                    iv: forge.util.decode64(data.iv)
                });
                c.update(forge.util.createBuffer(data.text));
                c.finish();
                var encrypted = c.output;
                self.postMessage({
                    result: forge.util.encode64(encrypted.bytes())
                });
                break;
            case 'decryptAesCtr':
                var c = forge.cipher.createDecipher("AES-CTR", forge.util
                    .decode64(data.secret));
                c.start({
                    iv: forge.util.decode64(data.iv)
                });
                c.update(forge.util.createBuffer(forge.util.decode64(data.text)));
                c.finish();
                var decrypted = c.output;
                self.postMessage({
                    result: decrypted.data
                });
                break;
            case 'stop':
                self.close(); // Terminates the worker.
                break;
            default:
                self.postMessage('Unknown command: ' + data.msg);
        };
    } catch (ex) {
        self.postMessage({
            error: ex.message
        });
    }
}, false);
