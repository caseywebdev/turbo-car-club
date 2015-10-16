FROM node:4.2.1
ENV MINIFY=1
RUN apt-get update && apt-get install -y ruby-full && gem install scss_lint
COPY src/client/package.json /code/
WORKDIR /code
RUN npm install
COPY src /code/src
RUN make -f src/client/Makefile
