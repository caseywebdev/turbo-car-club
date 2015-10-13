FROM node:0.12.7
ENV \
  PORT=80 \
  MINIFY=1
RUN apt-get update && \
    apt-get install -y ruby-full && \
    gem install scss_lint
COPY package.json /code/
WORKDIR /code
RUN npm install
COPY public /code/public
COPY src /code/src
COPY .eslintrc /code/
COPY .scss-lint.yml /code/
COPY cogs-client.js /code/
COPY cogs-server.js /code/
COPY Makefile /code/
RUN make && \
    rm -fr src .eslintrc cogs-client.js cogs-server.js Makefile package.json
CMD ["node", "build/node_modules/server"]
