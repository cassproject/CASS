module.exports = {
    apps : [
        {
          name: "CaSS Test",
          script: "./src/main/server.js",
          instances: 1,
          log_file: 'cass.log',
          env: {
            "CASS_LOOPBACK": "http://localhost/api/",
            "ELASTICSEARCH_ENDPOINT": "http://localhost:9200",
            "PORT": "80"
          }
        }
    ]
  }