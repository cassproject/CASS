FROM docker.elastic.co/elasticsearch/elasticsearch:5.6.12
COPY data /usr/share/elasticsearch/data
USER root

RUN chmod -R 777 /usr/share/elasticsearch/data

USER elasticsearch

EXPOSE 9200

CMD elasticsearch