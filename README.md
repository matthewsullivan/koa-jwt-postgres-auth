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

## Deploy

    $ git push heroku develop:master

## cURLS
Register

    $ curl http://thinkific-etl-test.herokuapp.com/api/v1/register -d 'email=[EMAIL]&firstName=[FIRST_NAME]&lastName=[LAST_NAME]&password=[PASSWORD]' 

Login

    $ curl http://thinkific-etl-test.herokuapp.com/api/v1/login -d 'email=[EMAIL]&password=[PASSWORD]'

Current

    $ curl http://thinkific-etl-test.herokuapp.com/api/v1/current -H 'Authorization: Bearer [ACCESS_TOKEN]'

Set Current

    $ curl -X 'PUT' http://thinkific-etl-test.herokuapp.com/api/v1/current -H 'Authorization: Bearer [ACCESS_TOKEN]' -d 'current=1000'

Next

    $ curl http://thinkific-etl-test.herokuapp.com/api/v1/next -H 'Authorization: Bearer [ACCESS_TOKEN]'