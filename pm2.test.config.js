module.exports = {
    apps : [
        {
          name: "CaSS Test",
          script: "./src/main/server.js",
          instances: 1,
          log_file: '/logs/cass.log',
          env: {
          },
          node_args: [
            "--max-old-space-size=1024"
          ]
        }
    ]
  }