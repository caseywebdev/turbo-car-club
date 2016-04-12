BIN=node_modules/.bin/
COGS=$(BIN)cogs
WATCHY=$(BIN)watchy

all: install cogs-server cogs-client

install:
	@echo 'Installing dependencies...'
	@npm install --loglevel error
	@echo 'Deduping dependencies...'
	@npm dedupe --loglevel error

class-names:
	@echo 'Building class names...'
	@ONLY_CLASS_NAMES=1 $(COGS) -sc cogs-client.js

cogs-client: class-names
	@echo 'Building client...'
	@$(COGS) -sc cogs-client.js

cogs-client-w: class-names
	@$(COGS) -c cogs-client.js \
		-pw build/client/class-names.json,src/client,src/shared

cogs-server:
	@echo 'Building server...'
	@$(COGS) -sc cogs-server.js

cogs-server-w:
	@$(COGS) -c cogs-server.js -pw src/host,src/shared,src/signal

host-w:
	@$(WATCHY) -pw build/host,build/shared -- bin/host

signal-w:
	@$(WATCHY) -pw build/shared,build/signal -- bin/signal
