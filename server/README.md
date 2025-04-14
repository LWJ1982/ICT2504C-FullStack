# SIT-URMS
# Instructions on how to run the application locally
## Setup the .env in the client folder (BackEnd)

```bash
# Server Configuration
PORT=3000 # Assign the port for this backend server
NODE_ENV=development # Define the environment

# Database Configuration
DB_HOST=localhost # Or put your MySQL ip address/hostname, recommend to test the connection first
DB_PORT=3306 # Default MySQL port
DB_NAME=<Database Name> # Your application database storage
DB_USER=<Database Username> # Make sure this user have the required privileges
DB_PASSWORD=<Database Password>

# Additional Configuration
JWT_SECRET = "your_app_secret" # Default
TOKEN_EXPIRES_IN = "30d" # Default, for production use 1 day
EMAIL_SERVICE = "gmail" # Prefer to be gmail
EMAIL_USER = "<Real Website Support Email>"
EMAIL_PASSWORD = "<App password in gmail>"
GOOGLE_CLIENT_ID = "<Google OAuth2 Platform Client ID>" # Specifically find the one that has .apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = "<The Client Secret key for Google OAuth2>"

# Allow the cors origin access below from client side
CORS_ORIGIN=http://localhost:3001,http://localhost:8080,http://127.0.0.1:3001,http://127.0.0.1:8080
```
## Dependancy for the server (BackEnd)
```bash
npm init -y
npm run install
```

## To start the server (BackEnd)
cd into the server folder
```bash
npm start
```

## Troubleshooting
For CMD terminal

Perform the below on the server folder

```bash
npm i nodemon --save-dev
npm uninstall bcrypt
npm i bcrypt --force

node server.js
```