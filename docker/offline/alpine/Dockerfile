FROM cassproject/cass:build

COPY docker/offline/alpine/config ./config
COPY docker/offline/alpine/config/server.xml /usr/local/tomcat/conf/server.xml

VOLUME /usr/share/elasticsearch/data

RUN mkdir CASS
COPY . CASS
RUN cd CASS && \
mvn -o install -Dmaven.repo.local="./.m2" && \
rm -rf /usr/local/tomcat/webapps/ROOT && \
mv target/cass.war /usr/local/tomcat/webapps/ROOT.war && \
cd .. && \
rm -rf ~/.m2 && \
rm -rf CASS && \
mkdir /usr/local/tomcat/etc && \
echo Done.

VOLUME /usr/local/tomcat/etc

EXPOSE 9200 9300
EXPOSE 8080

CMD su-exec elasticsearch elasticsearch --daemonize && catalina.sh start && tail -F /usr/local/tomcat/logs/catalina.out