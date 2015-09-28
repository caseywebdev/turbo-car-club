BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

dev:
	npm prune
	npm install
	make -j cogs-client-w cogs-server-w server

minify:
	$(COGS) -c cogs-server.js
	MINIFY=true $(COGS) -c cogs-client.js

cogs-client:
	$(COGS) -c cogs-client.js

cogs-client-w:
	$(COGS) -c cogs-client.js -pw src

cogs-server:
	rm -fr build
	$(COGS) -c cogs-server.js

cogs-server-w:
	$(COGS) -c cogs-server.js -pw src

postinstall:
	make -j cogs-client cogs-server

server:
	$(WATCHY) -pw build/node_modules -- node build/node_modules/server
