FROM docker.elastic.co/elasticsearch/elasticsearch:8.10.2

USER root
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -qqy nodejs && apt upgrade -qqy && apt clean

RUN openssl version
RUN apt install -qqy build-essential checkinstall zlib1g-dev wget libssl-dev curl clang && cd /usr/local/src && wget https://www.openssl.org/source/openssl-3.0.8.tar.gz && tar xvf openssl-3.0.8.tar.gz && cd openssl-3.0.8 && ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib enable-fips linux-x86_64 && make -j8 > make.log && make install > makeinstall.log && make install_ssldirs > makeinstallssldirs.log && make install_fips > makeinstallfips.log && cd / && apt remove -qqy build-essential checkinstall zlib1g-dev wget libssl-dev curl clang && rm -rf cd /usr/local/src/openssl-3.0.8 && apt autoremove -qqy && apt clean
RUN openssl version

ENV OPENSSL_CONF=/usr/local/ssl/nodejs.cnf
ENV OPENSSL_MODULES=/usr/local/ssl/lib64/ossl-modules

RUN echo 'nodejs_conf = nodejs_init' >> /usr/local/ssl/nodejs.cnf
RUN echo '.include /usr/local/ssl/fipsmodule.cnf' >> /usr/local/ssl/nodejs.cnf
RUN echo '[nodejs_init]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'providers = provider_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo '[provider_sect]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'default = default_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo 'fips = fips_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo '[default_sect]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'activate = 1' >> /usr/local/ssl/nodejs.cnf

USER elasticsearch
RUN mkdir CASS
COPY package.json CASS/package.json
RUN cd CASS && npm install --omit=dev && npm upgrade --production --omit=dev --save && npm audit --production --audit-level=high fix
COPY src CASS/src
COPY ca.crt CASS/ca.crt
COPY cass.crt CASS/cass.crt
COPY cass.key CASS/cass.key
COPY pm2.standalone.config.js CASS/pm2.standalone.config.js
COPY copyright.txt CASS/copyright.txt
COPY LICENSE CASS/LICENSE

USER root
RUN echo '-Xms2g' >> config/jvm.options
RUN echo '-Xmx2g' >> config/jvm.options
ENV bootstrap.memory_lock=true
ENV discovery.type=single-node
ENV xpack.security.enabled=false
ENV xpack.security.enrollment.enabled=false
ENV xpack.security.http.ssl.enabled=false
ENV xpack.security.transport.ssl.enabled=false
EXPOSE 80
VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/CASS/etc","/usr/share/elasticsearch/CASS/logs"]

USER elasticsearch
RUN mkdir CASS/etc
RUN mkdir CASS/logs

USER root
RUN mkdir /logs
RUN chown -R elasticsearch:root /logs

USER elasticsearch:root
ENTRYPOINT (cd CASS && npm run run:standalone && npm run logs) & /bin/tini -- /usr/local/bin/docker-entrypoint.sh