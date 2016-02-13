FROM node:5.6.0

WORKDIR /code

COPY Makefile /code/Makefile
COPY package.json /code/package.json
RUN make install

COPY . /code
RUN MINIFY=1 make

CMD ["bin/host"]
