FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.2

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -qqy nodejs git

RUN mkdir CASS
COPY src CASS/src
COPY package.json CASS/package.json
COPY ca.crt CASS/ca.crt
COPY cass.crt CASS/cass.crt
COPY cass.key CASS/cass.key
COPY pm2.standalone.config.js CASS/pm2.standalone.config.js
COPY copyright.txt CASS/copyright.txt
COPY LICENSE CASS/LICENSE
RUN cd CASS && npm install

RUN echo 'node.name: cass-a' >> config/elasticsearch.yml
RUN echo 'cluster.initial_master_nodes:' >> config/elasticsearch.yml
RUN echo '  - cass-a' >> config/elasticsearch.yml
RUN echo '-Xms4g' >> config/jvm.options
RUN echo '-Xmx4g' >> config/jvm.options
EXPOSE 80
VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/CASS/etc","/usr/share/elasticsearch/CASS/logs"]
ENTRYPOINT /usr/local/bin/docker-entrypoint.sh & (cd CASS && npm run run:standalone && npm run logs)