FROM elasticsearch:7.12.1


COPY scripts/cassInstall.sh cassInstall.sh
RUN chmod 755 cassInstall.sh && chown root:root cassInstall.sh && dos2unix cassInstall.sh
ENV CASS_VERSION=0.5
RUN ./cassInstall.sh
COPY . CASS
RUN cd CASS && git pull origin && npm i

CMD cd CASS && service apache2 start && service elasticsearch start && npm run run && npm run logs
VOLUME ["/var/lib/tomcat8/etc","/var/log/tomcat8","/var/log/elasticsearch","/var/lib/elasticsearch","/etc/default","/etc/apache2/"]
EXPOSE 80