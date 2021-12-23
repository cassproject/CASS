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
            "CASS_LOOPBACK": "http://localhost:8080/api/",
            "ELASTICSEARCH_ENDPOINT": "http://localhost:9200",
            "PORT": "8080",
            "CASS_BASE": "/cass"
          },
          node_args: [
            "--max-old-space-size=512"
          ]
        }
    ]
  }