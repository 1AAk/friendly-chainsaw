APP_NAME ?= uiux-frontend
DOCKER ?= docker
COMPOSE ?= $(DOCKER) compose

.PHONY: help install dev lint format fmt up down restart docker-dev docker-down docker-logs docker-build docker-run task task-done

help:
	@echo "Main commands:"
	@echo "  make up           # docker dev (HMR)"
	@echo "  make down         # stop docker dev"
	@echo "  make restart      # restart docker dev"
	@echo ""
	@echo "Other commands:"
	@echo "  make dev          # npm run dev"
	@echo "  make lint         # npm run lint"
	@echo "  make format       # npm run format"
	@echo "  make task NAME=\"...\" [DESC=\"...\"]"
	@echo "  make task-done ID=\"task_slug_hash\""

install:
	pnpm install

dev:
	npm run dev

lint:
	npm run lint

format:
	npm run format

fmt: format

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

docker-dev: up

docker-down: down

docker-logs:
	$(COMPOSE) logs -f

docker-build:
	$(DOCKER) build -t $(APP_NAME):prod .

docker-run:
	$(DOCKER) run --rm -p 8080:80 $(APP_NAME):prod

task:
	@if [ -z "$(NAME)" ]; then \
		echo "Error: NAME is required (use make task NAME=\"short title\")"; \
		exit 1; \
	fi
	@mkdir -p .memory_bank/tasks
	@HASH=$$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c6); \
	SLUG=$$(printf "%s" "$(NAME)" | tr '[:upper:]' '[:lower:]' | tr ' ' '_' | tr -cd 'a-z0-9_-'); \
	FILE=".memory_bank/tasks/task_$${SLUG}_$${HASH}.md"; \
	if [ -e "$$FILE" ]; then \
		echo "Error: $$FILE already exists, retry to regenerate hash."; \
		exit 1; \
	fi; \
	DATE=$$(date -u +"%Y-%m-%dT%H:%M:%SZ"); \
	echo "Creating $$FILE"; \
	printf "# Task: %s\n- Created: %s\n- Id: task_%s_%s\n- Status: Planned\n\n## Summary\n%s\n\n## Notes\n- \n" \
	"$(NAME)" "$$DATE" "$${SLUG}" "$${HASH}" "$${DESC:-Add summary here.}" > "$$FILE"; \
	if ! grep -q '^# Current Tasks' .memory_bank/current_tasks.md 2>/dev/null; then \
		echo "# Current Tasks" > .memory_bank/current_tasks.md; \
		echo "" >> .memory_bank/current_tasks.md; \
	fi; \
		if ! grep -q "task_$${SLUG}_$${HASH}" .memory_bank/current_tasks.md; then \
			printf "\n- [ ] %s (task_%s_%s)\n" "$(NAME)" "$${SLUG}" "$${HASH}" >> .memory_bank/current_tasks.md; \
		fi; \
		echo "Task created with id task_$${SLUG}_$${HASH}"

task-done:
	@if [ -z "$(ID)" ]; then \
		echo "Error: ID is required (e.g. make task-done ID=task_slug_hash)"; \
		exit 1; \
	fi
	@ARCHIVE=".memory_bank/tasks/archive"; \
	@mkdir -p "$$ARCHIVE"; \
	FILE=".memory_bank/tasks/$(ID).md"; \
	if [ ! -f "$$FILE" ]; then \
		echo "Error: $$FILE not found"; \
		exit 1; \
	fi; \
	node -e "const fs=require('fs');const file=process.argv[1];let data=fs.readFileSync(file,'utf8');data=data.replace(/- Status: .*/, '- Status: Completed');fs.writeFileSync(file,data);" "$$FILE"; \
	if [ -f ".memory_bank/current_tasks.md" ]; then \
		node -e "const fs=require('fs');const id=process.argv[1];const file='.memory_bank/current_tasks.md';let data=fs.readFileSync(file,'utf8');const re=new RegExp('- \\\\[ \\] (.*\\\\('+id+'\\\\))');data=data.replace(re,'- [x] $1');fs.writeFileSync(file,data);" "$(ID)"; \
	fi; \
	mv "$$FILE" "$$ARCHIVE/"; \
	echo "Task $(ID) marked as completed."
