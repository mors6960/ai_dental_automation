# Local Infra

This project primarily assumes a shared machine-level Docker stack, not a repo-specific one.

Expected common services:
- MySQL container `mysql_c`
- phpMyAdmin container `phpmyadmin_c`
- Redis container `redis_c`
- MySQL database `testdb_automation`
- host ports `3306`, `8084`, and `6379`

## Services

- `mysql`: fallback local relational database for the MVP
- `phpmyadmin`: fallback local database admin UI
- `redis`: fallback BullMQ/automation queue backend

## Default Workflow

```bash
mysql -h127.0.0.1 -uroot -padmin123 -e "SHOW DATABASES;"
```

## URLs

- MySQL: `127.0.0.1:${DB_PORT}`
- phpMyAdmin: `http://127.0.0.1:${PHPMYADMIN_PORT}`
- Redis: `127.0.0.1:${REDIS_PORT}`

## Optional Fallback

Use the checked-in compose file only when you explicitly want isolated project-local infra:

```bash
cd /Users/mor/Work/ai-dental-automation/infra
docker-compose --env-file ../.env up -d
```
