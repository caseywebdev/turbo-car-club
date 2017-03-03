FROM node:7.7.1

RUN apt-get update && apt-get install -y nginx

WORKDIR /code

COPY package.json /code/package.json
RUN npm install

COPY .eslintrc /code/.eslintrc
COPY .stylelintrc /code/.stylelintrc
COPY bin/build /code/bin/build
COPY etc/cogs.js /code/etc/cogs.js
COPY etc/nginx.conf /code/etc/nginx.conf
COPY src /code/src
ENV CLIENT_URL http://www.dev.turbocarclub.com
RUN MINIFY=1 bin/build

COPY bin /code/bin
COPY etc /code/etc

ENV KEY foo
ENV MAIL_ENABLED 0
ENV MAIL_FROM_ADDRESS support@turbocarclub.com
ENV MAIL_FROM_NAME Turbo Car Club
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres
ENV REGIONS dev=http://www.dev.turbocarclub.com
ENV SIGNAL_URL ws://signal.dev.turbocarclub.com

ARG VERSION
ENV VERSION $VERSION

CMD ["bin/client"]
