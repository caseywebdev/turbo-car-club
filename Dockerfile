FROM node:6.6.0

ENV NGINX_VERSION 1.11.4
RUN mkdir -p /usr/local/nginx/logs && \
    curl -L https://nginx.org/download/nginx-$NGINX_VERSION.tar.gz | \
      tar xz -C /usr/local/nginx --strip-components 1 && \
    cd /usr/local/nginx && \
    ./configure --with-http_ssl_module && \
    make && \
    ln -s /usr/local/nginx/objs/nginx /usr/local/bin/

ENV CONSUL_TEMPLATE_VERSION 0.15.0
RUN curl -L https://releases.hashicorp.com/consul-template/$CONSUL_TEMPLATE_VERSION/consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip > \
      consul-template.zip && \
    apt-get update && \
    apt-get install -y unzip && \
    unzip consul-template.zip && \
    mv consul-template /usr/local/bin/ && \
    rm consul-template.zip

ENV CONTAINERPILOT_VERSION 2.4.1
RUN curl -L https://github.com/joyent/containerpilot/releases/download/$CONTAINERPILOT_VERSION/containerpilot-$CONTAINERPILOT_VERSION.tar.gz | \
      tar xz -C /usr/local/bin/

WORKDIR /code

# Install node modules
COPY package.json /code/package.json
RUN npm install

# Build class names
COPY .stylelintrc /code/.stylelintrc
COPY bin/build-client /code/bin/build-client
COPY etc/cogs/client.js /code/etc/cogs/client.js
COPY src/client/styles /code/src/client/styles
RUN MINIFY=1 ONLY_CLASS_NAMES=1 bin/build-client

# Build client
COPY .eslintrc /code/.eslintrc
COPY src/client /code/src/client
COPY src/shared /code/src/shared
RUN MINIFY=1 bin/build-client

# Build server
COPY bin/build-server /code/bin/build-server
COPY etc/cogs/server.js /code/etc/cogs/server.js
COPY src /code/src
RUN bin/build-server

COPY bin /code/bin
COPY etc /code/etc

ENV CLIENT_URL https://www.dev.turbocarclub.com
ENV CONSUL_URL https://consul.dev.turbocarclub.com
ENV CONSUL_AUTH foo:bar
ENV KEY xxx
ENV LIVERELOAD_URL https://livereload.dev.turbocarclub.com
ENV MAIL_ENABLED 0
ENV MAIL_FROM_ADDRESS support@turbocarclub.com
ENV MAIL_FROM_NAME Turbo Car Club
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres
ENV REGIONS dev=https://www.dev.turbocarclub.com
ENV SIGNAL_URL wss://signal.dev.turbocarclub.com

# Bake version (git SHA1 revision) into the image
ARG VERSION
ENV VERSION $VERSION

EXPOSE 80

CMD ["true"]
