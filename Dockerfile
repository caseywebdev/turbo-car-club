FROM node:6

WORKDIR /code

COPY . /code

ARG CLIENT_URL=http://www.turbocarclub.com
ARG SIGNAL_URL=http://signal.turbocarclub.com

ENV CLIENT_URL $CLIENT_URL
ENV KEY foo
ENV MAIL_ENABLED 0
ENV MAIL_FROM_ADDRESS support@turbocarclub.com
ENV MAIL_FROM_NAME Turbo Car Club
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres
ENV SIGNAL_URL $SIGNAL_URL

RUN MINIFY=1 make

CMD ["bin/host"]
