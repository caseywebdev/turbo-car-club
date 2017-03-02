FROM node:7.6.0

RUN apt-get update && \
    apt-get install -y unzip nginx && \
    curl https://dl.eff.org/certbot-auto > /usr/local/bin/certbot-auto && \
    chmod +x /usr/local/bin/certbot-auto && \
    certbot-auto -n -h

WORKDIR /code

# There's a bad dependency somewhere causing wrtc to fail building, but it works
# fine if it's installed in isolation.
RUN npm install wrtc

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

ENV CLIENT_URL http://www.dev.turbocarclub.com
ENV KEY foo
ENV MAIL_ENABLED 0
ENV MAIL_FROM_ADDRESS support@turbocarclub.com
ENV MAIL_FROM_NAME Turbo Car Club
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres
ENV REGIONS dev=http://www.dev.turbocarclub.com
ENV SIGNAL_URL ws://signal.dev.turbocarclub.com

# Bake version (git SHA1 revision) into the image
ARG VERSION
ENV VERSION $VERSION

CMD ["bin/client"]
