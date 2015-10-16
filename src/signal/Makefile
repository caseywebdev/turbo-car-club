BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

all:
	@$(COGS) -c src/signal/cogs.js

dev:
	@make -f src/signal/Makefile -j cogs-w signal-w

cogs-w:
	@$(COGS) -c src/signal/cogs.js -pw src

signal-w:
	@$(WATCHY) -pw build node build/node_modules/signal
