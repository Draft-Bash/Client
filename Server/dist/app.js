"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http")); // Import http module
const socketServer_1 = require("./utils/socketServer");
const sendVerificationEmail = require("./utils/nodeMailer/sendVerificationEmail");
const trimInputsMiddleware = require("./middleware/trimInputsMiddleware");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app); // Create an HTTP server using the Express app
const io = (0, socketServer_1.createWebSocket)(3000); // Pass the HTTP server to the createWebSocket function
const cors = require('cors');
app.set('view engine', 'ejs');
app.use(express_1.default.json());
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
