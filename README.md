# Stackable Feature Tracker.

for [Stackable](https://github.com/stackabletech).

# Development

Hosted dev version available [here](https://feature-tracker.vercel.app)

## Install dependencies

```
npm i
```

## Set up the Postgresql server

Export the Postgres password (needed for the container and psql below)

```
export PGPASSWORD=hush1234
export PGHOST=localhost
export PGUSER=postgres
export PGDATABASE=postgres
export DB_SCHEMA=feature_tracker

```

Start Postgres in a container in the background.

```
docker run -d --name postgres -e POSTGRES_PASSWORD=${PGPASSWORD} -p 5432:5432 postgres:16.2-alpine3.19
```

Create and populate the database
```
npx prisma migrate dev --name init
psql -h localhost -U postgres -f sample/data.sql
```

## Run the app

```
cp .env.example .env
npm run dev -- --open
```

# Migrating the DB

## Create baseline migration

Only needed once

```
git switch main
mkdir -p prisma/migrations/0_init
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
npx prisma migrate resolve --applied 0_init
```

## Migrate the life cycle DB schema

```
git switch feat/lifecycle
npx prisma migrate dev --name lifecycle
```

# Schema description

|          Name           |   Type   | Description                              |
|-------------------------|----------|------------------------------------------|
| releases                | table    | SDP releases like `23.11`, etc. |
| release_versions        | table    | SDP patch releases like `23.11.0`, etc. |
| categories              | table    | Feature categories like `Certifications`, `Authentication`, etc. |
| features                | table    | All platform features like `LDAP`, `arm64`, `TLS`. Each feature belongs to a category. |
| product_features        | table    | Aggregates features per product and release. An `implementation_status` column contains values like `COMPLETED`, `NOT_PLANNED`, etc. |
| product_lifecycles      | table    | Aggregates the lifecycle state of a `product version` in a `release`. |
| product_versions        | table    | All product versions for all products. Example: `2.6.1` for Apache Airflow, etc. |
| products                | table    | All products. Example: `Apache Airflow`, `Druid`, etc. |
| release_components      | table    | All components included in a release version. A component is identified by a PURL. Currently only contains container images. |

