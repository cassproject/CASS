FROM node:20-slim
USER root
WORKDIR /app
COPY package.json ./
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt update && apt dist-upgrade -y && apt clean

RUN apt install -qqy build-essential checkinstall zlib1g-dev wget libssl-dev curl clang && cd /usr/local/src && wget https://www.openssl.org/source/openssl-3.0.8.tar.gz && tar xvf openssl-3.0.8.tar.gz && cd openssl-3.0.8 && ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib enable-fips linux-x86_64 && make -j8 > make.log && make install > makeinstall.log && make install_ssldirs > makeinstallssldirs.log && make install_fips > makeinstallfips.log && cd / && rm -rf cd /usr/local/src/openssl-3.0.8 && apt remove -qqy build-essential checkinstall zlib1g-dev wget libssl-dev curl clang && apt autoremove -qqy && apt clean
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

RUN npm install --production --omit=dev && npm upgrade --production --omit=dev --save && npm audit --production --omit=dev --audit-level=high --fix && chown root:root node_modules -R
COPY src src
COPY ca.crt ca.crt
COPY cass.crt cass.crt
COPY cass.key cass.key
COPY copyright.txt copyright.txt
COPY LICENSE LICENSE
EXPOSE 80
ENV HTTP2=false
CMD node --force-fips ./src/main/server.js