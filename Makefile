.PHONY: run-all docker-build

run-all:
	@chmod +x scripts/run_all.sh
	@./scripts/run_all.sh

docker-build:
	docker-compose build

docker-up:
	docker-compose up
