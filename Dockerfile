FROM node:6

WORKDIR /code

# Install node modules
COPY package.json /code/package.json
RUN npm install && npm dedupe

ARG SIGNAL_URL=wss://signal.turbocarclub.com
ENV SIGNAL_URL $SIGNAL_URL

ARG VERSION
ENV VERSION $VERSION

# Build class names
COPY .stylelintrc /code/.stylelintrc
COPY bin /code/bin
COPY cogs-client.js /code/cogs-client.js
COPY src/client/styles /code/src/client/styles
RUN MINIFY=1 ONLY_CLASS_NAMES=1 bin/build-client

# Build client
COPY .eslintrc /code/.eslintrc
COPY src/client /code/src/client
COPY src/shared /code/src/shared
RUN MINIFY=1 bin/build-client

# Build server
COPY cogs-server.js /code/cogs-server.js
COPY src/host /code/src/host
COPY src/signal /code/src/signal
RUN bin/build-server

ARG CLIENT_URL=http://www.turbocarclub.com
ENV CLIENT_URL $CLIENT_URL

ENV CERT_FILE .ssl/cert
ENV KEY_FILE .ssl/key
ENV MAIL_FROM_ADDRESS support@turbocarclub.com
ENV MAIL_FROM_NAME Turbo Car Club
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres

CMD ["node", "build/signal"]
