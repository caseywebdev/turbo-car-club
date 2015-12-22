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
	@npm install
	@make -j cogs-client cogs-server

bootstrap:
	@docker-compose up -d
	@sleep 5
	@docker-compose run cogs-client make
	@docker-compose run signal make migrate

class-names:
	@$(COGS) -c cogs-client.js src/client/styles/index.scss:build/client

cogs-client: class-names
	@$(COGS) -c cogs-client.js

cogs-client-w: class-names
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
