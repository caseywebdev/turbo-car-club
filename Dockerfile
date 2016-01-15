FROM node:5.4.0
RUN apt-get update && apt-get install -y ruby-full && gem install scss_lint
COPY \
  bin \
  src \
  .eslintrc \
  .scss-lint.yml \
  cogs-client.js \
  cogs-server.js \
  Makefile \
  package.json \
  /code/
WORKDIR /code
RUN MINIFY=1 make
EXPOSE 80
CMD ["bin/host"]
