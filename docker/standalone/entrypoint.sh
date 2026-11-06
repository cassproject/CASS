#!/bin/sh
# Starts CaSS in the background, then Elasticsearch in the foreground under tini.
# exec makes tini PID 1, so docker stop reaches Elasticsearch.
(cd CASS && node --force-fips src/main/server.js) &
exec /bin/tini -- /usr/local/bin/docker-entrypoint.sh
