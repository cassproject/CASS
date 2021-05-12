module.exports = {
    apps : [
        {
          name: "CaSS",
          script: "./src/main/server.js",
          watch: true,
          instances: 1,
          env: {
            "CASS_LOOPBACK": "http://localhost/api/",
            "ELASTICSEARCH_ENDPOINT": "http://localhost:9200",
            "PORT": "8080",
            "CASS_BASE": "/cass"
          }
        }
    ]
  }