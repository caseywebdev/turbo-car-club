BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

all:
	@$(COGS) -c src/host/cogs.js

dev:
	@make -f src/host/Makefile -j cogs-w host-w

cogs-w:
	@$(COGS) -c src/host/cogs.js -pw src

host-w:
	@$(WATCHY) -pw build node build/node_modules/host
