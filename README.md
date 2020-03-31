<p align="center"><img alt="Stack Logos" src="https://www.static.matthewsullivan.media/kjp.png" width="480" /></p>

## Koa, JWT, and Postgres Authentication
Lightweight user registration API that returns stateless [json web tokens](https://jwt.io/) to access secured routes.

#### Installation
Install dependencies

    $ npm install

#### Database
Install Postgres

    https://postgresapp.com/

Create database

    $ createdb kjpa_test

#### Setup
Set environment and build database

    $ export NODE_ENV=development && npm run db-init

#### Serve
    $ npm run debug

#### Test
    $ export NODE_ENV=development && npm run db-init && npm run test

#### cURLS
Register

    $ curl http://127.0.0.1:3000/api/v1/register/ -d 'email=[EMAIL]&firstName=[FIRST_NAME]&lastName=[LAST_NAME]&password=[PASSWORD]' 

Login

    $ curl http://127.0.0.1:3000/api/v1/login/ -d 'email=[EMAIL]&password=[PASSWORD]'
    
View Profile

    $ curl http://127.0.0.1:3000/api/v1/profile/1 -H 'Authorization: Bearer [ACCESS_TOKEN]'
    
Update Profile

    $ curl http://127.0.0.1:3000/api/v1/user/profile -d 'email=[EMAIL]&firstName=[FIRST_NAME]&lastName=[LAST_NAME]' -H 'Authorization: Bearer [ACCESS_TOKEN]'
    
Update Password

    $ curl http://127.0.0.1:3000/api/v1/user/password -d 'password=[PASSWORD]' -H 'Authorization: Bearer [ACCESS_TOKEN]'
    
## Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

Please make sure to update and or write tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
