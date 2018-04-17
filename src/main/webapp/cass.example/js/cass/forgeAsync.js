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
