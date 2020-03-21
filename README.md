# Simple Back-end

## Synopsis

Simple back-end using [Koa.js](https://koajs.com)/[PostgreSQL](https://www.postgresql.org)

## Install

Open terminal at project root and execute

    $ npm install

## Configure

### CORS 

Set origin (client) URL

    $ export URL_ORIGIN='http://127.0.0.1:8081'

## Setup

Initialize and seed database

    $ export NODE_ENV=development && npm run db-init

## Serve

    $ export SIMPLE_SCHEDULER="false" && npm run debug

## Test

    $ NODE_ENV=test && npm test
