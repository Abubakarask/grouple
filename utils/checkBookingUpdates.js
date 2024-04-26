const { getActiveUsers } = require("../socketio");

exports.emitBookingUpdates = (userId) => {
  const activeUsers = getActiveUsers();

  if (activeUsers.hasOwnProperty(userId)) {
    require("../server").io.emit("update-bookings", userId);
  }
};
