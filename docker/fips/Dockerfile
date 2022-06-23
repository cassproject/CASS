FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.4

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -qqy nodejs git build-essential checkinstall zlib1g-dev wget libssl-dev curl clang

RUN openssl version
RUN cd /usr/local/src && wget https://www.openssl.org/source/openssl-3.0.3.tar.gz && tar xvf openssl-3.0.3.tar.gz && cd openssl-3.0.3 && ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib enable-fips linux-x86_64 && make -j8 > make.log && make install > makeinstall.log && make install_ssldirs > makeinstallssldirs.log && make install_fips > makeinstallfips.log && cd /
RUN openssl version

RUN git clone https://github.com/nodejs/node.git -b v18.x
RUN cd node && export OPENSSL_ENABLE_MD5_VERIFY=true && export OPENSSL_CONF=/usr/local/ssl/openssl.cnf && export OPENSSL_MODULES=/usr/local/ssl/lib64/ossl-modules && ./configure --shared-openssl --shared-openssl-libpath=/usr/local/ssl/lib64 --shared-openssl-includes=/usr/local/ssl/include --shared-openssl-libname=crypto,ssl --openssl-is-fips > configure.log && export LD_LIBRARY_PATH=/usr/local/ssl/lib64 && make -j8 > make.log && make install > makeinstall.log && cd ..

ENV OPENSSL_ENABLE_MD5_VERIFY=true
ENV OPENSSL_CONF=/usr/local/ssl/openssl.cnf
ENV OPENSSL_MODULES=/usr/local/ssl/lib64/ossl-modules
ENV LD_LIBRARY_PATH=/usr/local/ssl/lib64
ENV HTTP2=false
ENV FIPS=true

RUN echo '.include /usr/local/ssl/fipsmodule.cnf' >> /usr/local/ssl/openssl.cnf
RUN echo '[provider_sect]' >> /usr/local/ssl/openssl.cnf
RUN echo 'default = default_sect' >> /usr/local/ssl/openssl.cnf
RUN echo 'fips = fips_sect' >> /usr/local/ssl/openssl.cnf
RUN echo '[default_sect]' >> /usr/local/ssl/openssl.cnf
RUN echo 'activate = 1' >> /usr/local/ssl/openssl.cnf

RUN mkdir CASS
COPY package.json CASS/package.json
RUN cd CASS && npm install && cd ..
COPY src CASS/src
COPY etc CASS/etc
COPY ca.crt CASS/ca.crt
COPY cass.crt CASS/cass.crt
COPY cass.key CASS/cass.key
COPY pm2.standalone.config.js CASS/pm2.standalone.config.js
COPY copyright.txt CASS/copyright.txt
COPY LICENSE CASS/LICENSE
RUN cd CASS

RUN echo 'discovery.type: single-node' >> config/elasticsearch.yml
RUN echo 'node.name: cass-a' >> config/elasticsearch.yml
RUN echo '-Xms4g' >> config/jvm.options
RUN echo '-Xmx4g' >> config/jvm.options

EXPOSE 80
VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/CASS/etc","/usr/share/elasticsearch/CASS/logs"]
ENTRYPOINT /usr/local/bin/docker-entrypoint.sh & (cd CASS && npm run run:standalone && npm run logs)