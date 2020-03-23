## Install

Install dependencies

    $ npm install

## Database

Install Postgres

        https://postgresapp.com/ (simplest way)

Create database

    $ createdb simple_api

## Setup

Set environment and build database

    $ export NODE_ENV=development && npm run db-init

## Serve

    $ npm run debug

## Test

    $ export NODE_ENV=development && npm run db-init && npm run test

## Deploy

    $ git push heroku develop:master

## cURLS
Register

    $ curl http://thinkific-etl-test.herokuapp.com/api/v1/register -d 'email=johndoe@localhost.com&firstName=John&lastName=Doe&password=(a1B2c3D4e5F6g)' 

Login

    $ curl http://thinkific-etl-test.herokuapp.com/api/v1/login -d 'email=johndoe@localhost.com&password=(a1B2c3D4e5F6g)'

Current

    $ curl -X 'PUT' http://thinkific-etl-test.herokuapp.com/api/v1/current -H 'Authorization: Bearer [access_token]'

Set Current

    $ curl -X 'PUT' http://thinkific-etl-test.herokuapp.com/api/v1/current -H 'Authorization: Bearer [access_token]' -d 'current=1000'

Next

    $ curl http://thinkific-etl-test.herokuapp.com/api/v1/next -H 'Authorization: Bearer [access_token]'