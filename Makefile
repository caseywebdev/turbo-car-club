DC=docker-compose

outdated:
	@$(DC) run client npm outdated
	@$(DC) run host npm outdated
	@$(DC) run signal npm outdated
