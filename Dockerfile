FROM node:4.2.1
RUN apt-get update && apt-get install -y ruby-full && gem install scss_lint
COPY package.json /code/
WORKDIR /code
RUN npm install
COPY . /code
RUN MINIFY=1 make
CMD ["node", "node_modules/build/host"]
