FROM docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.2

VOLUME /usr/share/elasticsearch/data
RUN curl -sL https://rpm.nodesource.com/setup_16.x | bash -
RUN yum install -y nodejs git

ENV CASS_VERSION=0.5
COPY src CASS/src
COPY package.json CASS/package.json
COPY *.js CASS/

RUN cd CASS && \
npm install

ENV CASS_REPLICATION_ENDPOINT=https://dev.cassproject.org/api/

RUN echo 'node.name: cass-a' >> config/elasticsearch.yml
RUN echo 'cluster.initial_master_nodes:' >> config/elasticsearch.yml
RUN echo '  - cass-a' >> config/elasticsearch.yml
EXPOSE 80
VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/CASS/etc","/usr/share/elasticsearch/CASS/logs"]
ENTRYPOINT /usr/local/bin/docker-entrypoint.sh & (cd CASS && npm run run:standalone && npm run logs)