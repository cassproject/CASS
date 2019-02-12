FROM ubuntu:18.04
RUN apt-get update;apt-get install -qqy wget curl software-properties-common sudo gawk
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
ARG VERSION=master
RUN wget https://raw.githubusercontent.com/cassproject/CASS/master/scripts/cassInstall.sh
RUN chmod +x cassInstall.sh
RUN echo $VERSION && /cassInstall.sh $VERSION && rm -rf ~/.m2
RUN echo 'JAVA_OPTS="-Djava.awt.headless=true -Xmx1g -XX:+UseConcMarkSweepGC"' >> /etc/default/tomcat8
CMD service elasticsearch start;service tomcat8 start;service apache2 start;sudo mkdir /var/lib/tomcat8/etc;sudo chown tomcat8:tomcat8 /var/lib/tomcat8/etc;tail -F /var/lib/tomcat8/logs/catalina.out
VOLUME ["/var/lib/tomcat8/etc","/var/log/tomcat8","/var/log/elasticsearch","/var/lib/elasticsearch","/etc/default","/etc/apache2/"]
EXPOSE 80