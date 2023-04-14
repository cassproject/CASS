FROM docker.elastic.co/elasticsearch/elasticsearch:8.7.0

USER root
RUN curl -sL https://deb.nodesource.com/setup_19.x | bash -
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -qqy nodejs && apt upgrade -qqy

USER elasticsearch
RUN mkdir CASS
COPY src CASS/src
COPY package.json CASS/package.json
COPY ca.crt CASS/ca.crt
COPY cass.crt CASS/cass.crt
COPY cass.key CASS/cass.key
COPY pm2.standalone.config.js CASS/pm2.standalone.config.js
COPY copyright.txt CASS/copyright.txt
COPY LICENSE CASS/LICENSE
RUN cd CASS && npm install --omit=dev && npm audit fix

USER root
RUN echo 'node.name: cass-a' >> config/elasticsearch.yml
RUN echo 'cluster.initial_master_nodes:' >> config/elasticsearch.yml
RUN echo '  - cass-a' >> config/elasticsearch.yml
RUN echo '-Xms4g' >> config/jvm.options
RUN echo '-Xmx4g' >> config/jvm.options
ENV xpack.security.enabled=false
ENV xpack.security.http.ssl.enabled=false
ENV xpack.security.transport.ssl.enabled=false
EXPOSE 80
VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/CASS/etc","/usr/share/elasticsearch/CASS/logs"]

USER elasticsearch
RUN mkdir CASS/etc
RUN mkdir CASS/logs

USER root
RUN mkdir /logs
RUN chown -R elasticsearch:root /logs

USER elasticsearch:root
ENTRYPOINT (cd CASS && npm run run:standalone && npm run logs) & /bin/tini -- /usr/local/bin/docker-entrypoint.sh