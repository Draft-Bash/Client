import express from 'express';
import http from 'http'; // Import http module
import { createWebSocket } from './utils/socketServer';

const sendVerificationEmail = require("./utils/nodeMailer/sendVerificationEmail");
const trimInputsMiddleware = require("./middleware/trimInputsMiddleware");

const app = express();
const server = http.createServer(app); // Create an HTTP server using the Express app

const io = createWebSocket(3000); // Pass the HTTP server to the createWebSocket function

const cors = require('cors');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(trimInputsMiddleware);

app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/drafts", require("./routes/drafts"));

app.get("/", (req, res) => {
  res.send("Hello, TypeScript Express App!");
});

const port = 5000; // Define the port number here

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;