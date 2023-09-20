# Individual Developer Process & Configuration

### Environment Setup
- Code written primarily in Typescript.
1. Download Postgresql
2. Git clone the server and client repositories.
3. (Server) run 'npm install' to download the dependencies.
4. (Server) generate a .env file in the root directory and add these variables:
  DB_HOST=localhost
  DB_NAME=nameOfTheDatabaseYouCreatedOnYourLocaPostgresql
  DB_USER=nameOfYourLocalPostgresUser
  DB_PASSWORD=nameOfYourLocalPostgresUser'sPassword
  DB_PORT=5432
  JWT_SECRET=anyRandomSetOfCharactersWillWork
5. (Server) Run 'npx knex migrate:latest' to run the database migrations. All changes to the database must be made through migrations, which can be created by running npx knex migrate:make. Knex.js is the package used for handling the database migrations.
6. (Server) Only run 'npx knex seed:run' once so that the local database is filled with data like nba players, nba teams, etc.
7. (Server) Run 'npm run dev' to host the server on your localhost's port 3000. This command will cause any updates in your code to be reflected in the running localhost server.
8. (Client) Run 'npm install' to install the dependencies for the Client.
9. (Client) Create a .env file in the root directory with these variables:
    API_URL=http://localhost:3000/api/v1
    SERVER_URL=http://localhost:3000
10. (Client) Run 'npm run dev' to run the frontend on your localhost's port 5173. Any updates you make to the code will be instantl reflected on the running instance on localhost:5173. For the local frontend to interact with the local backend, both the server and client must be running.
