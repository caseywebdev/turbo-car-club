BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy
HOST=node build/node_modules/host
SIGNAL=node build/node_modules/signal

all:
	@make -j cogs-client cogs-server

dev:
	@make -j cogs-client-w cogs-server-w host-w signal-w

cogs-client:
	@$(COGS) -c cogs-client.js

cogs-client-w:
	@$(COGS) -c cogs-client.js -pw src

cogs-server:
	@$(COGS) -c cogs-server.js

cogs-server-w:
	@$(COGS) -c cogs-server.js -pw src

host-w:
	@PORT=8080 SIGNAL_URL=ws://localhost \
		$(WATCHY) -w build/node_modules -- $(HOST)

signal-w:
	@PORT=80 $(WATCHY) -w build/node_modules -- $(SIGNAL)
