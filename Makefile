BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

dev:
	npm prune
	npm install
	rm -fr build
	$(COGS) -c cogs-server.js
	make -j cogs-client-w cogs-server-w server

cogs-client-w:
	$(COGS) -c cogs-client.js -pw src

cogs-server-w:
	$(COGS) -c cogs-server.js -pw src

server:
	$(WATCHY) -pw build/node_modules -- node build/node_modules/server
