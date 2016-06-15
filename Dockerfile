FROM node:6

ARG CLIENT_URL=http://www.turbocarclub.com
ARG SIGNAL_URL=ws://signal.turbocarclub.com

ENV CLIENT_URL $CLIENT_URL
ENV MAIL_FROM_ADDRESS support@turbocarclub.com
ENV MAIL_FROM_NAME Turbo Car Club
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres
ENV SIGNAL_URL $SIGNAL_URL

WORKDIR /code

# Install node modules
COPY package.json /code/package.json
RUN npm install && npm dedupe

# Build class names
COPY bin /code/bin
COPY .stylelintrc /code/.stylelintrc
COPY src/client/styles /code/src/client/styles
COPY cogs-client.js /code/cogs-client.js
RUN MINIFY=1 ONLY_CLASS_NAMES=1 bin/build-client

# Build client
COPY .eslintrc /code/.eslintrc
COPY src/client /code/src/client
COPY src/shared /code/src/shared
RUN MINIFY=1 bin/build-client

# Build server
COPY src/host /code/src/host
COPY src/signal /code/src/signal
RUN bin/build-server

CMD ["bin/host"]
