# Thesis-project
### Application

1.  Install backend dependencies (must be into server folder)

        npm i

2.  Install frontend dependencies (must be into client folder)

        npm install -g @angular/cli
        npm i

3.  Install telegram dependencies (must be into telegram folder)

        npm i

4.  Complete configuration files

        * server/.env - Complete the db connection parameters & telegram token
        * server/src/config/config.json - Complete transportConfigProd with parameters to invite to a user
        * client/src/environments/environment.prod.ts - Complete uri of server
        * client/src/environments/environment.ts - Complete uri of server

5.  To run the application on the server

    node app.js

6.  To run the application on the client

    ng serve -o
