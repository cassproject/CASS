FROM docker.elastic.co/elasticsearch/elasticsearch:8.8.1

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt upgrade -qqy
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -qqy git nodejs

ENV CASS_VERSION=1.5
COPY src CASS/src
COPY etc CASS/etc
COPY package.json CASS/package.json
COPY *.js CASS/

RUN cd CASS && \
npm install

RUN echo 'node.name: cass-a' >> config/elasticsearch.yml
RUN echo 'cluster.initial_master_nodes:' >> config/elasticsearch.yml
RUN echo '  - cass-a' >> config/elasticsearch.yml
EXPOSE 80
VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/CASS/etc","/usr/share/elasticsearch/CASS/logs"]
ENTRYPOINT /usr/local/bin/docker-entrypoint.sh & (cd CASS && npm run run:test && npm run logs)