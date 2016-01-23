FROM node:5.5.0
COPY . /code
WORKDIR /code
RUN MINIFY=1 make
CMD ["bin/host"]
