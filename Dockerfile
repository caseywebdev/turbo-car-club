FROM node:6

ENV NGINX_VERSION 1.10.1
RUN wget https://nginx.org/download/nginx-$NGINX_VERSION.tar.gz \
      -O nginx.tar.gz && \
    tar -xzf nginx.tar.gz && \
    cd nginx-$NGINX_VERSION && \
    ./configure && \
    make && \
    cp objs/nginx /usr/local/bin/ && \
    cd - && \
    rm -fr nginx.tar.gz nginx-$NGINX_VERSION

ENV CONTAINERPILOT_VERSION 2.3.0
RUN wget https://github.com/joyent/containerpilot/releases/download/$CONTAINERPILOT_VERSION/containerpilot-$CONTAINERPILOT_VERSION.tar.gz \
      -O containerpilot.tar.gz && \
    tar -xzf containerpilot.tar.gz && \
    mv containerpilot /usr/local/bin/ && \
    rm containerpilot.tar.gz

WORKDIR /code

# Install node modules
COPY package.json /code/package.json
RUN npm install && npm dedupe

# Build class names
COPY .stylelintrc /code/.stylelintrc
COPY bin /code/bin
COPY etc/cogs/client.js /code/etc/cogs/client.js
COPY src/client/styles /code/src/client/styles
RUN MINIFY=1 ONLY_CLASS_NAMES=1 bin/build-client

ARG SIGNAL_URL=ws://signal.turbocarclub.com
ENV SIGNAL_URL $SIGNAL_URL

ARG VERSION
ENV VERSION $VERSION

# Build client
COPY .eslintrc /code/.eslintrc
COPY src/client /code/src/client
COPY src/shared /code/src/shared
RUN MINIFY=1 bin/build-client

# Build server
COPY etc/cogs/server.js /code/etc/cogs/server.js
COPY src /code/src
RUN bin/build-server

COPY etc /code/etc

ARG CLIENT_URL=http://www.turbocarclub.com
ENV CLIENT_URL $CLIENT_URL

ENV KEY xxx
ENV MAIL_FROM_ADDRESS support@turbocarclub.com
ENV MAIL_FROM_NAME Turbo Car Club
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres

CMD ["bin/signal"]
