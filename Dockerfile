FROM node:7.6.0

RUN apt-get update && \
    apt-get install -y unzip && \
    curl https://dl.eff.org/certbot-auto > /usr/local/bin/certbot-auto && \
    chmod +x /usr/local/bin/certbot-auto && \
    certbot-auto -n -h

ENV NGINX_VERSION 1.11.10
RUN mkdir -p /usr/local/nginx/logs && \
    curl -L https://nginx.org/download/nginx-$NGINX_VERSION.tar.gz | \
      tar xz -C /usr/local/nginx --strip-components 1 && \
    cd /usr/local/nginx && \
    ./configure --with-http_ssl_module && \
    make && \
    ln -s /usr/local/nginx/objs/nginx /usr/local/bin/

ENV CONSUL_TEMPLATE_VERSION 0.18.1
RUN curl -L https://releases.hashicorp.com/consul-template/$CONSUL_TEMPLATE_VERSION/consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip > \
      consul-template.zip && \
    unzip consul-template.zip && \
    mv consul-template /usr/local/bin/ && \
    rm consul-template.zip

ENV CONTAINERPILOT_VERSION 2.7.0
RUN curl -L https://github.com/joyent/containerpilot/releases/download/$CONTAINERPILOT_VERSION/containerpilot-$CONTAINERPILOT_VERSION.tar.gz | \
      tar xz -C /usr/local/bin/

WORKDIR /code

# Install node modules
COPY package.json /code/package.json
RUN npm install

# Build
COPY .eslintrc /code/.eslintrc
COPY .stylelintrc /code/.stylelintrc
COPY bin/build /code/bin/build
COPY etc/cogs.js /code/etc/cogs.js
COPY src /code/src
RUN MINIFY=1 bin/build

COPY bin /code/bin
COPY etc /code/etc

ENV CLIENT_SERVER_NAME www.dev.turbocarclub.com
ENV CLIENT_URL https://www.dev.turbocarclub.com
ENV CONSUL_URL http://consul:8500
ENV KEY foo
ENV LETSENCRYPT_ENABLED 0
ENV MAIL_ENABLED 0
ENV MAIL_FROM_ADDRESS support@turbocarclub.com
ENV MAIL_FROM_NAME Turbo Car Club
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres
ENV REGIONS dev=https://www.dev.turbocarclub.com
ENV SIGNAL_URL wss://signal.dev.turbocarclub.com

# Bake version (git SHA1 revision) into the image
ARG VERSION
ENV VERSION $VERSION

EXPOSE 80 443

CMD ["bin/lb"]
