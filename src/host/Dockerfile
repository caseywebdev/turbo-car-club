FROM node:4.2.1
ENV PORT=80
COPY src/host/package.json /code/
WORKDIR /code
RUN npm install
COPY src /code/src
RUN make -f src/host/Makefile
CMD ["node", "build/node_modules/server"]
