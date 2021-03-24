FROM ubuntu:16.04
RUN sed -i -e 's/http:\/\/archive/mirror:\/\/mirrors/' -e 's/\/ubuntu\//\/mirrors.txt/' /etc/apt/sources.list
RUN sed -i -e 's/http:\/\/security/mirror:\/\/mirrors/' -e 's/\/ubuntu\//\/mirrors.txt/' /etc/apt/sources.list
RUN apt update && apt install -qqy dos2unix ca-certificates curl software-properties-common lsb-core sudo vim systemd gawk git wget
COPY scripts/cassInstall.sh cassInstall.sh
RUN chmod 755 cassInstall.sh && chown root:root cassInstall.sh && dos2unix cassInstall.sh
ENV CASS_VERSION=fritz/node
RUN ./cassInstall.sh

CMD cd CASS && service elasticsearch start && npm run run && npm run logs
VOLUME ["/var/lib/tomcat7/etc","/var/log/tomcat7","/var/log/elasticsearch","/var/lib/elasticsearch","/etc/default","/etc/apache2/"]
EXPOSE 80