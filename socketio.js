const socketio = require("socket.io");
const activeUsers = {};

// Function to initiate Socket.io
const initiateSocketio = (server) => {
  // Initialize Socket.io with the provided server
  const io = socketio(server);

  io.on("connection", (socket) => {
    console.log("A user connected!", socket.id);
    activeUsers[socket.id] = [];

    socket.on("join-user-room", (roomId) => {
      socket.join(roomId); // Join the specific room
      activeUsers[roomId] = activeUsers[roomId] || [];

      // Send existing messages to the user
      activeUsers[roomId].forEach((message) => {
        io.to(roomId).emit("message-received", message);
      });
    });

    socket.on("get-active-rooms", () => {
      socket.emit("active-rooms", activeUsers);
    });

    socket.on("new-message", (data) => {
      const { message, roomId, isAdmin } = data;

      const formattedMessage = isAdmin ? `[Admin] ${message}` : message;

      activeUsers[roomId] = activeUsers[roomId] || [];
      activeUsers[roomId].push(formattedMessage);
      io.to(roomId).emit("message-received", formattedMessage);
      io.emit("admin-message-received", {
        roomId,
        message: formattedMessage,
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected.");
      delete activeUsers[socket.id];
    });
  });
};

module.exports = initiateSocketio;
