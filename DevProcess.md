# Individual Developer Process & Configuration

### Environment Setup
- Code written primarily in Typescript. Must be compiled into Javascript before running locally
1. (Server repository) Execute command "npm run build" in terminal to compile the code in Javascript
2. (Server repostiory) Execute command "npm run start" in terminal start the server on localhost:3000
3. (Client repository) After running the two commands in steps 1 & 2 in sequential order on the server side, have your client repository open as well.
4. (Client repository) While the server is still running on localhost:3000, type "npm run dev" in the terminal associated with the Client repository
5. You should now be able to begin testing the application by typing http://localhost:5173
6. The server runs on port 3000, but you do not need to access it. It is just so the server can interact with the client. You will only need to navigate to port 5173