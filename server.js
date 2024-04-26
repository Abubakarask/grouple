const http = require("http");
const app = require("./app");
const { initiateSocketio } = require("./socketio");

let server = http.createServer(app);
const PORT = process.env.PORT || 3600;

// create a server and initiate socketio
const io = initiateSocketio(server);
exports.io = io;

server.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}...`);
});
