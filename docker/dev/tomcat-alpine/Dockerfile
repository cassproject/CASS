FROM tomcat:9.0.19-jre11-slim
COPY target/cass.war /usr/local/tomcat/webapps/ROOT.war
RUN rm -rf /usr/local/tomcat/webapps/ROOT
RUN mkdir /usr/local/tomcat/etc
VOLUME /usr/local/tomcat/etc/

ENV CATALINA_OPTS="-Dnashorn.args=--language=es6"
EXPOSE 8080