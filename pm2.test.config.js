module.exports = {
    apps : [
        {
          name: "CaSS Test",
          script: "./src/main/server.js",
          instances: 1,
          log_file: '/logs/cass.log',
          env: {
          },
          args: [
            "--max_old_space_size=512"
          ]
        }
    ]
  }