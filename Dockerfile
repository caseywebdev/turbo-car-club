FROM node:5
WORKDIR /code
COPY . /code
RUN MINIFY=1 make
CMD ["bin/host"]
