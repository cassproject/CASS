FROM docker.elastic.co/elasticsearch/elasticsearch:7.16.2

VOLUME /usr/share/elasticsearch/data
RUN yum clean all && yum update -y
RUN curl -sL https://rpm.nodesource.com/setup_16.x | bash -
RUN yum install -y nodejs-2:16.9.1-1nodesource.x86_64 git

ENV CASS_VERSION=0.5
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