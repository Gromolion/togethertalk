init: create-symlinks copy-env up-and-build

create-symlinks:
	ln -s ../backend/package.json backend/package.json
	ln -s ../backend/package-lock.json backend/package-lock.json
	ln -s ../frontend/package.json frontend/package.json
	ln -s ../frontend/package-lock.json frontend/package-lock.json

copy-env:
	cp backend/.env ../backend/.env

up-and-build:
	docker-compose up -d --build

up-and-build-force:
	docker-compose up -d --build --force-recreate

down:
	docker-compose down