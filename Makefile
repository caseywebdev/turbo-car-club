BIN=node_modules/.bin/
COGS=$(BIN)cogs
SERVER=node build/node_modules/server
WATCHY=$(BIN)watchy

all:
	make -j cogs-server cogs-client

dev:
	make -j cogs-client-w cogs-server-w server-w

cogs-client:
	$(COGS) -c cogs-client.js

cogs-client-w:
	$(COGS) -c cogs-client.js -pw src

cogs-server:
	rm -fr build
	$(COGS) -c cogs-server.js

cogs-server-w:
	$(COGS) -c cogs-server.js -pw src

server-w:
	$(WATCHY) -pw build/node_modules -- $(SERVER)
