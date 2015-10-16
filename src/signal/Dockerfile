FROM node:4.2.1
ENV PORT=80
COPY src/signal/package.json /code/
WORKDIR /code
RUN npm install
COPY src /code/src
RUN make -f src/signal/Makefile
CMD ["node", "build/node_modules/server"]
