DOCKER_COMPOSE = docker compose

.PHONY: setup dev down reset seed logs

# Primera vez: copia .env, instala deps, levanta Docker y aplica migraciones
setup:
	@[ -f .env ] || cp .env.example .env && echo "✅ .env creado — completá las API keys"
	@cd backend && [ -f .env ] || cp .env.example .env
	@cd frontend && [ -f .env ] || cp .env.example .env
	$(DOCKER_COMPOSE) up -d db
	@echo "⏳ Esperando PostgreSQL..."
	@sleep 5
	@cd backend && npm install && npx prisma migrate deploy && npx prisma db seed
	@cd frontend && npm install
	@echo "✨ Setup completo. Corré 'make dev' para iniciar."

# Levantar todo con Docker
dev:
	$(DOCKER_COMPOSE) up --build

# Solo el backend en local (sin Docker)
dev-local:
	@cd backend && npm run dev &
	@cd frontend && npm run dev

down:
	$(DOCKER_COMPOSE) down

# Borrar todo y volver a empezar (incluyendo volúmenes de DB)
reset:
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up -d db
	@sleep 5
	@cd backend && npx prisma migrate deploy && npx prisma db seed

seed:
	@cd backend && npx prisma db seed

logs:
	$(DOCKER_COMPOSE) logs -f backend
