FROM tomcat:9.0.12-jre8-alpine
COPY target/cass.war /usr/local/tomcat/webapps/ROOT.war
RUN rm -rf /usr/local/tomcat/webapps/ROOT
RUN mkdir /usr/local/tomcat/etc
VOLUME /usr/local/tomcat/etc/
EXPOSE 8080