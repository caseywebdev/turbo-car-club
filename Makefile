BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy
KNEX=$(BIN)knex \
	--knexfile build/signal/config.js \
	--env knex

all:
	@npm install
	@make -j cogs-client cogs-server

npm-install:
	@docker-compose run cogs-client npm install

bootstrap:
	@docker-compose stop
	@docker-compose rm -f
	@docker-compose up -d postgres
	@sleep 5
	@docker-compose run cogs-client make
	@docker-compose run signal make migrate
	@docker-compose up -d

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

host-w:
	@$(WATCHY) -pw build/host,build/shared -- bin/host

signal-w:
	@$(WATCHY) -pw build/shared,build/signal -- bin/signal

migrate:
	@$(KNEX) migrate:latest

migrate-rollback:
	@$(KNEX) migrate:rollback
