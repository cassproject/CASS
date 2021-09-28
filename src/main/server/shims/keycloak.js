var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
    clientId: 'cass',
    bearerOnly: true,
    serverUrl: 'http://localhost/auth',
    realm: 'master',
    realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkwt84nTJJ++fZcVCCKZqFgCBhworalSDkU4PVOMjiRTdjITCULYptDldmqbOpO/qaDhU57f+0d3jQvuGBU6q+3kbmrTgm5EBaIJpEB/2x1DArxW2LaXD9HsyEUZBVcYB2ehs9ZjqEgzRm02YgXhfz5QvkJrRUkAK8zfJ3y3EA85fqvpZjaAVSoiDPRrP3YjVuPGOTXW8ehfDW9jkIn+8TO7fAeKhDiHsNOFS6MKlXwPReutjROTGWjyfPK7LyAzu7cU5MeEUzMBbv5d8MCtwsArS0WE4HXHQ9sjscg7JGQXDijSbn/6VeEkxrS23GGtvOBmIovtECoUXAe/YZocJ5wIDAQAB',
    credentials: {
        secret: '7d67cc12-4567-4fe6-8a5e-2df4c12235d7'
    }
};

function initKeycloak(app) {
    if (_keycloak) {
        console.warn("Trying to init Keycloak again!");
        return _keycloak;
    } 
    else {
        console.log("Initializing Keycloak...");
        var memoryStore = new session.MemoryStore();
        app.use(session({
            secret: '7d67cc12-4567-4fe6-8a5e-2df4c12235d7',
            resave: false,
            saveUninitialized: true,
            store: memoryStore
        }));
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    } 
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};