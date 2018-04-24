FROM ubuntu:16.04
ARG VERSION=master
RUN apt-get update;apt-get install -qqy wget curl software-properties-common sudo gawk
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
RUN wget https://raw.githubusercontent.com/cassproject/CASS/master/scripts/cassInstall.sh
RUN chmod +x cassInstall.sh
RUN /cassInstall.sh $VERSION && rm -rf ~/.m2
CMD service elasticsearch start;service tomcat7 start;service apache2 start;/bin/bash
VOLUME ["/var/lib/tomcat7","/var/log/tomcat7","/var/lib/elasticsearch","/etc/default","/etc/apache2/"]
EXPOSE 80

