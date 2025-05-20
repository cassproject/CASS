module.exports = {
    apps : [
        {
          name: "CaSS",
          script: "./src/main/server.js",
          watch: true,
          ignore_watch: ["/logs"],
          instances: 1,
          log_file: '/logs/cass.log',
          env: {
            "CASS_LOOPBACK": "http://localhost:8080/api/",
            "PORT": "8080"
          },
          node_args: [
            "--max-old-space-size=512"
          ]
        }
    ]
  }