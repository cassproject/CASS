module.exports = {
    apps : [
        {
          name: "CaSS",
          script: "./src/main/server.js",
          watch: true,
          ignore_watch: ["logs", "node_modules"],
          instances: 1,
          log_file: 'logs/cass.log',
          env: {
            "CASS_LOOPBACK": "https://<endpoint>/api/",
            "ELASTICSEARCH_ENDPOINT": "http://localhost:9200",
            "PORT": "8080",
            "CASS_BASE": "",
            "CASS_OIDC_ISSUER_BASE_URL": "https://login.microsoftonline.com/common",
            "CASS_OIDC_CLIENT_ID": "<client_id>",
            "CASS_OIDC_BASE_URL": "https://<endpoint>/",
            "CASS_OIDC_SECRET": "<client_secret>",
            "CASS_OIDC_ENABLED": "true"
          },
          node_args: [
            "--max-old-space-size=512"
          ]
        }
    ]
  }
