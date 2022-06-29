module.exports = {
    apps : [
        {
          name: "CaSS",
          script: "./src/main/server.js",
          instances: 1,
          log_file: '/logs/cass.log',
          env: {
            /*"CASS_LOOPBACK": "https://woohoo.i.dont.exist/api/",
            "CASS_LOOPBACK_PROXY": "http://localhost/api/",*/
          },
          node_args: [
            "--max-old-space-size=512"
          ]
        }
    ]
  }