## Install

Install dependencies

    $ npm install

## Setup

Set environment and build database

    $ export NODE_ENV=development && npm run db-init

## Serve

    $ npm run debug

## Test

    $ export NODE_ENV=development && npm run db-init && npm run test

## Deploy

https://thinkific-etl-test.herokuapp.com

db postgresql-angular-51177 as DATABASE_URL

    $ git push heroku develop:master

## cURLS
Register

    $ curl -d 'email=johndoe@localhost.com&firstName=John&lastName=Doe&password=(a1B2c3D4e5F6g)' http://thinkific-etl-test.herokuapp.com/api/v1/register

Login
    $ curl -d 'email=johndoe@localhost.com&password=(a1B2c3D4e5F6g)' http://thinkific-etl-test.herokuapp.com/api/v1/login/
