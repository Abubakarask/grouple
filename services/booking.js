const Booking = require("../db/models/booking");

exports.getAllBookingsService = async (body, role) => {
  try {
    const { sort = "createdAt:DESC", page = 1, limit = 10, userId } = body;

    const filter = {};

    if (role === "user") {
      filter.userId = userId;
    }

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * limit;

    const bookings = await Booking.findAndCountAll({
      where: filter,
      order: [[sort.split(":")[0], sort.split(":")[1]]], // Parse sort criteria
      limit: parseInt(limit),
      offset,
    });

    const totalPages = Math.ceil(bookings.count / limit);

    return {
      success: true,
      content: {
        data: bookings.rows, // Extract bookings data
        meta: {
          sort,
          page,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};
