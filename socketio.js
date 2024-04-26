const socketio = require("socket.io");
const { getAllBookingsService } = require("./services/booking");
const activeRooms = {};
const activeUsers = {};

// Function to initiate Socket.io
const initiateSocketio = (server) => {
  // Initialize Socket.io with the provided server
  const io = socketio(server);

  io.on("connection", (socket) => {
    console.log("A user connected!", socket.id);
    activeRooms[socket.id] = [];

    socket.on("add-to-active-users", (socketId, userId) => {
      activeUsers[userId] = socketId;
    });

    socket.on("join-user-room", (roomId) => {
      socket.join(roomId); // Join the specific room
      activeRooms[roomId] = activeRooms[roomId] || [];

      // Send existing messages to the user
      activeRooms[roomId].forEach((message) => {
        io.to(roomId).emit("message-received", message);
      });
    });

    socket.on("get-active-rooms", () => {
      socket.emit("active-rooms", activeRooms);
    });

    socket.on("new-message", (data) => {
      const { message, roomId, isAdmin } = data;

      const formattedMessage = isAdmin ? `[Admin] ${message}` : message;

      activeRooms[roomId] = activeRooms[roomId] || [];
      activeRooms[roomId].push(formattedMessage);
      io.to(roomId).emit("message-received", formattedMessage);
      io.emit("admin-message-received", {
        roomId,
        message: formattedMessage,
      });
    });

    // Handle 'get-all-bookings' event
    socket.on("bookings", async (userId) => {
      try {
        const bookings = await getAllBookingsService(
          { limit: 1000, userId },
          "user"
        );
        socket.emit("bookings", bookings);
      } catch (error) {
        console.log(error);
        console.error("Error fetching bookings:", error.message);
        socket.emit("bookings", {
          success: false,
          message: "Failed to retrieve bookings",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected.");
      delete activeRooms[socket.id];
    });
  });

  return io;
};

function getActiveUsers() {
  return activeUsers;
}

module.exports = { initiateSocketio, getActiveUsers };
