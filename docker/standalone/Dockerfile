# Elasticsearch 9.x images are based on RHEL UBI (microdnf), not Ubuntu (apt),
# so packages are installed with microdnf rather than apt.
#
# Both the FIPS-enabled OpenSSL and Node.js are prepared in a throwaway builder
# stage and copied into the runtime image, so no compiler or build headers ever
# ship in the final image. (On RHEL the toolchain cannot be cleanly uninstalled
# afterwards: annobin depends on gcc and perl-CPAN depends on make.)
#
# Node.js comes from the official nodejs.org tarball rather than the NodeSource
# RPM on purpose: the RPM declares a dependency on python3, which drags Python
# and its transitive libraries into the image (the single largest cluster of OS
# CVEs here) even though CaSS has no native modules and never needs node-gyp.
FROM docker.elastic.co/elasticsearch/elasticsearch:9.4.5 AS build-deps
USER root
RUN microdnf install -y --nodocs gcc make perl-core zlib-devel tar xz diffutils && microdnf clean all
RUN cd /usr/local/src && curl -fsSLO https://www.openssl.org/source/openssl-3.1.2.tar.gz && tar xf openssl-3.1.2.tar.gz && cd openssl-3.1.2 && ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib enable-fips && make -j8 > make.log && make install > makeinstall.log && make install_ssldirs > makeinstallssldirs.log && make install_fips > makeinstallfips.log

ARG TARGETARCH
ARG NODE_VERSION=v24.19.0
RUN case "$TARGETARCH" in \
        amd64) NARCH=x64 ;; \
        arm64) NARCH=arm64 ;; \
        *) echo "unsupported architecture: $TARGETARCH" && exit 1 ;; \
    esac \
    && cd /tmp \
    && curl -fsSLO "https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-${NARCH}.tar.xz" \
    && curl -fsSLO "https://nodejs.org/dist/${NODE_VERSION}/SHASUMS256.txt" \
    && grep " node-${NODE_VERSION}-linux-${NARCH}.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
    && mkdir -p /opt/node \
    && tar -xJf "node-${NODE_VERSION}-linux-${NARCH}.tar.xz" -C /opt/node --strip-components=1 \
    && rm -f node-*.tar.xz SHASUMS256.txt

FROM docker.elastic.co/elasticsearch/elasticsearch:9.4.5

USER root
# Apply base-image security updates before the package manager is removed below.
RUN microdnf update -y && microdnf clean all

COPY --from=build-deps /usr/local/ssl /usr/local/ssl
COPY --from=build-deps /opt/node /opt/node
ENV PATH=/opt/node/bin:$PATH
RUN /usr/local/ssl/bin/openssl version && node --version

ENV OPENSSL_CONF=/usr/local/ssl/nodejs.cnf
# OPENSSL_MODULES path varies by architecture (lib64 on amd64, lib on arm64)
RUN OSSL_MOD=$(find /usr/local/ssl -name 'ossl-modules' -type d | head -1) && \
    ln -sfn "$OSSL_MOD" /usr/local/ssl/ossl-modules
ENV OPENSSL_MODULES=/usr/local/ssl/ossl-modules

RUN echo 'nodejs_conf = nodejs_init' >> /usr/local/ssl/nodejs.cnf
RUN echo '.include /usr/local/ssl/fipsmodule.cnf' >> /usr/local/ssl/nodejs.cnf
RUN echo '[nodejs_init]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'providers = provider_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo '[provider_sect]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'default = default_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo 'fips = fips_sect' >> /usr/local/ssl/nodejs.cnf
RUN echo '[default_sect]' >> /usr/local/ssl/nodejs.cnf
RUN echo 'activate = 1' >> /usr/local/ssl/nodejs.cnf

RUN npm upgrade --global --production --omit=dev

USER elasticsearch
RUN mkdir CASS
COPY --chown=elasticsearch package.json CASS/package.json
RUN cd CASS && npm install --omit=dev && npm upgrade --production --omit=dev --save && (npm audit --production --omit=dev --fix || true)
COPY --chown=elasticsearch src CASS/src
COPY --chown=elasticsearch ca.crt CASS/ca.crt
COPY --chown=elasticsearch cass.crt CASS/cass.crt
COPY --chown=elasticsearch cass.key CASS/cass.key
COPY --chown=elasticsearch client.crt CASS/client.crt
COPY --chown=elasticsearch client.key CASS/client.key
COPY --chown=elasticsearch copyright.txt CASS/copyright.txt
COPY --chown=elasticsearch LICENSE CASS/LICENSE

USER root
RUN echo '-Xms2g' >> config/jvm.options
RUN echo '-Xmx2g' >> config/jvm.options
RUN echo 'xpack.security.enabled: false' >> config/elasticsearch.yml
RUN echo 'xpack.security.enrollment.enabled: false' >> config/elasticsearch.yml
RUN echo 'xpack.security.http.ssl.enabled: false' >> config/elasticsearch.yml
RUN echo 'xpack.security.transport.ssl.enabled: false' >> config/elasticsearch.yml
RUN echo 'discovery.type: single-node' >> config/elasticsearch.yml

# --- Attack-surface reduction: drop build-time-only OS packages ---
# The package manager stack and curl are not used by the Elasticsearch
# entrypoint (which needs only grep/exec) or by CaSS (Node uses its own fetch).
#
# Dependency checking is deliberately left ON (no --nodeps): rpm itself
# verifies that nothing remaining requires these packages, so the build fails
# loudly rather than silently producing a broken image. This exact set is what
# rpm approves; systemd-libs and libgcrypt, for example, have to stay because
# procps-ng requires systemd-libs, which in turn requires libgcrypt. rpm -e is
# used rather than deleting files so the RPM database stays truthful and
# scanners keep reporting an accurate inventory.
RUN rpm -e \
      microdnf libdnf librepo libsolv libmodulemd \
      curl-minimal libcurl-minimal \
      glib2 gobject-introspection json-glib libpeas librhsm \
      libxml2 libarchive gnupg2 gpgme nmap-ncat openldap \
      krb5-libs cyrus-sasl-lib libnghttp2 \
      rpm rpm-libs \
    && rm -rf /var/cache/dnf /var/cache/yum

EXPOSE 80
VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/CASS/etc","/usr/share/elasticsearch/CASS/logs"]

USER elasticsearch
RUN mkdir CASS/etc
RUN mkdir CASS/logs

USER root
RUN mkdir /logs
RUN chown -R elasticsearch:root /logs

ENV HTTP2=false
USER elasticsearch:root

ARG TEST=false
RUN if [ "$TEST" = "true" ] ; then export PORT=8080 && export CASS_LOOPBACK=http://localhost:8080/api/ && cd CASS && npm i && (nohup /bin/tini -- /usr/local/bin/docker-entrypoint.sh > /dev/null 2>&1 & (npm run mochaDev)) && npm ci --production --omit=dev ; fi
RUN if [ "$TEST" = "true" ] ; then rm -rf /usr/share/elasticsearch/data/* ; fi
RUN if [ "$TEST" = "true" ] ; then export PORT=8080 && export CASS_LOOPBACK=https://localhost:8080/api/ && cd CASS && npm i && (nohup /bin/tini -- /usr/local/bin/docker-entrypoint.sh > /dev/null 2>&1 & (npm run mochaDevHttps)) && npm ci --production --omit=dev ; fi
RUN rm -f CASS/client.key CASS/client.crt

# npm and corepack are build-time only — the entrypoint runs node directly and
# CaSS never shells out to npm. Removing them here (after the optional TEST
# stage, which does use npm) drops npm's bundled dependency tree and its CVEs.
USER root
RUN rm -rf /opt/node/lib/node_modules/npm /opt/node/bin/npm /opt/node/bin/npx \
           /opt/node/lib/node_modules/corepack /opt/node/bin/corepack \
           /opt/node/include /opt/node/share \
    && rm -rf /root/.npm /usr/share/elasticsearch/.npm /tmp/*
USER elasticsearch:root

ENTRYPOINT (cd CASS && node --force-fips src/main/server.js) & /bin/tini -- /usr/local/bin/docker-entrypoint.sh