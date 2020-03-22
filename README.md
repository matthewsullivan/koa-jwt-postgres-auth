## Install

Install dependencies

    $ npm install

## Configure

### CORS 

Set origin (client) URL

    $ export URL_ORIGIN='http://127.0.0.1:8081'

## Setup

Set environment and build database

    $ export NODE_ENV=development && npm run db-init

## Serve

    $ npm run debug

## Test

    $ export NODE_ENV=test && npm test
