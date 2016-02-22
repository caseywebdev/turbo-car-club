FROM node:5

# Workaround until https://github.com/npm/npm/issues/9863 is resolved.
RUN curl -L https://npmjs.org/install.sh | npm_install=2 sh

WORKDIR /code

COPY Makefile /code/Makefile
COPY package.json /code/package.json
RUN make install

COPY . /code
RUN MINIFY=1 make

CMD ["bin/host"]
