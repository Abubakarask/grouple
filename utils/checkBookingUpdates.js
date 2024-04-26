const { getActiveUsers } = require("../socketio");

// function emits on an event which displays the updated bookings on the user side
exports.emitBookingUpdates = (userId) => {
  const activeUsers = getActiveUsers();

  if (activeUsers.hasOwnProperty(userId)) {
    require("../server").io.emit("update-bookings", userId);
  }
};
