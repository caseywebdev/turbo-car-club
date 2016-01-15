BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy
KNEX=$(BIN)knex \
	--knexfile build/signal/config.js \
	--env knex

all: dependencies cogs-server cogs-client

dependencies:
	@echo 'Installing dependencies...'
	@npm install --loglevel error
	@echo 'Deduping dependencies...'
	@npm dedupe --loglevel error

schema: cogs-server
	@echo 'Building schema...'
	@bin/build-schema

schema-w: cogs-server
	@$(WATCHY) -w build/shared/data -i 'schema.json$$' -- bin/build-schema

class-names:
	@echo 'Building class names...'
	@ONLY_CLASS_NAMES=1 $(COGS) -sc cogs-client.js

cogs-client: schema class-names
	@echo 'Building client...'
	@$(COGS) -sc cogs-client.js

cogs-client-w: schema class-names
	@$(WATCHY) -pw build/shared/data/schema.json -- \
		$(COGS) -c cogs-client.js -pw src

cogs-server:
	@echo 'Building server...'
	@$(COGS) -sc cogs-server.js

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

bootstrap:
	@docker-compose stop
	@docker-compose up -d postgres
	@sleep 5
	@docker-compose run cogs-client make
	@docker-compose run signal make migrate
	@docker-compose up -d
