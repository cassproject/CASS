FROM ubuntu:xenial-20210416
RUN sed -i -e 's/http:\/\/archive/mirror:\/\/mirrors/' -e 's/\/ubuntu\//\/mirrors.txt/' /etc/apt/sources.list
RUN sed -i -e 's/http:\/\/security/mirror:\/\/mirrors/' -e 's/\/ubuntu\//\/mirrors.txt/' /etc/apt/sources.list
RUN apt update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt upgrade -qqy && apt install -qqy ca-certificates curl dos2unix gawk git lsb-core software-properties-common sudo systemd vim wget
COPY scripts/cassInstall.sh cassInstall.sh
RUN chmod 755 cassInstall.sh && chown root:root cassInstall.sh && dos2unix cassInstall.sh
ENV CASS_VERSION=1.5
RUN ./cassInstall.sh
COPY . CASS
RUN cd CASS && git pull origin && npm i

CMD cd CASS && service apache2 start && service elasticsearch start && npm run run:cassbase && npm run logs
VOLUME ["/var/lib/tomcat8/etc","/var/log/tomcat8","/var/log/elasticsearch","/var/lib/elasticsearch","/etc/default","/etc/apache2/"]
EXPOSE 80