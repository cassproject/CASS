FROM --platform=linux/amd64 node:20-slim
WORKDIR /app
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt update && \ 
apt dist-upgrade -y && \
apt install -qqy build-essential checkinstall clang curl libssl-dev wget zlib1g-dev && \
cd /usr/local/src && \
wget https://www.openssl.org/source/openssl-3.1.2.tar.gz && \
tar xvf openssl-3.1.2.tar.gz && \
cd openssl-3.1.2 && \
./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib enable-fips linux-x86_64 && \
make -j8 > make.log && \
make install > makeinstall.log && \
make install_ssldirs > makeinstallssldirs.log && \
make install_fips > makeinstallfips.log && \
cd / && \
rm -rf /usr/local/src/openssl-3.1.2 && \
rm -rf /usr/local/src/openssl-3.1.2.tar.gz && \
apt remove -qqy build-essential checkinstall zlib1g-dev wget libssl-dev curl clang && \
apt autoremove -qqy && \
apt clean && \
echo "nodejs_conf = nodejs_init" >> /usr/local/ssl/nodejs.cnf && \
echo ".include /usr/local/ssl/fipsmodule.cnf" >> /usr/local/ssl/nodejs.cnf && \
echo "[nodejs_init]" >> /usr/local/ssl/nodejs.cnf && \
echo "providers = provider_sect" >> /usr/local/ssl/nodejs.cnf && \
echo "[provider_sect]" >> /usr/local/ssl/nodejs.cnf && \
echo "default = default_sect" >> /usr/local/ssl/nodejs.cnf && \
echo "fips = fips_sect" >> /usr/local/ssl/nodejs.cnf && \
echo "[default_sect]" >> /usr/local/ssl/nodejs.cnf && \
echo "activate = 1" >> /usr/local/ssl/nodejs.cnf

ENV OPENSSL_CONF=/usr/local/ssl/nodejs.cnf
ENV OPENSSL_MODULES=/usr/local/ssl/lib64/ossl-modules

COPY package.json ./

RUN npm install --production --omit=dev && \
npm upgrade --production --omit=dev --save && \
npm upgrade --global --production --omit=dev && \
npm audit --production --omit=dev --audit-level=high --fix && \
chown root:root node_modules -R

COPY src src
COPY ca.crt cass.crt cass.key copyright.txt ./

EXPOSE 80
ENTRYPOINT [ "node", "--force-fips", "./src/main/server.js" ]