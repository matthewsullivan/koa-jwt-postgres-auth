## Install

Install dependencies

    $ npm install

## Database

Install Postgres

    https://postgresapp.com/

Create database

    $ createdb kjpa_test

## Setup

Set environment and build database

    $ export NODE_ENV=development && npm run db-init

## Serve

    $ npm run debug

## Test

    $ export NODE_ENV=development && npm run db-init && npm run test

## cURLS
Register

    $ curl http://localhost:3000 -d 'email=[EMAIL]&firstName=[FIRST_NAME]&lastName=[LAST_NAME]&password=[PASSWORD]' 

Login

    $ curl http://localhost:3000 -d 'email=[EMAIL]&password=[PASSWORD]'