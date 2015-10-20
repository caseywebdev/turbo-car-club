BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy
KNEX=$(BIN)knex \
	--cwd build/node_modules/signal \
	--knexfile build/node_modules/signal/config.js \
	--env knex
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
	@$(COGS) -c cogs-server.js -pw src/host,src/shared,src/signal

host:
	@$(HOST)

host-w:
	@$(WATCHY) -pw build/node_modules/host,build/node_modules/shared -- \
		$(HOST)

signal:
	@$(SIGNAL)

signal-w:
	@$(WATCHY) -pw build/node_modules/shared,build/node_modules/signal -- \
		$(SIGNAL)

migrate:
	@$(KNEX) migrate:latest

migrate-rollback:
	@$(KNEX) migrate:rollback
