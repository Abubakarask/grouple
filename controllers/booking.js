const { Op } = require("sequelize");
const Booking = require("../db/models/booking");
const User = require("../db/models/user");
const { padCount } = require("../utils/padCount");

exports.createBooking = async (req, res) => {
  try {
    const { userId, noOfUsers } = req.body;
    let { startTime, endTime } = req.body;

    if (!userId || !noOfUsers || !startTime || !endTime) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "name",
            message: "Please fill all required details",
            code: "INVALID_INFO",
          },
        ],
      });
    }

    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "userId",
            message: "User does not exist",
            code: "INVALID_INFO",
          },
        ],
      });
    }

    startTime = new Date(startTime);
    endTime = new Date(endTime);
    // Validate start and end time format
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            message: "Invalid start or end time format",
            code: "INVALID_INFO",
          },
        ],
      });
    }

    // Validate start time before end time
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            message: "Start time must be before end time",
            code: "INVALID_INFO",
          },
        ],
      });
    }

    // Check MAX_COUNT from environment variable
    const maxBookingCount = parseInt(process.env.MAX_BOOKING, 10);

    // Check availability for the requested time slot
    const existingBookings = await Booking.findAndCountAll({
      where: {
        startTime: {
          [Op.lte]: endTime,
        },
        endTime: {
          [Op.gte]: startTime,
        },
      },
    });

    if (existingBookings.count + noOfUsers > maxBookingCount) {
      return res.status(400).json({
        success: false,
        message:
          "Room is not available for the requested time slot. Maximum booking count reached.",
        code: "NOT_AVAILABLE",
      });
    }

    // Calculate duration (in hours)
    const durationInHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));

    const bookingCount = await Booking.count({});

    // Generate the public_id based on total booking count
    const count = padCount(5, bookingCount + 1);
    const publicId = `BOOKING${count}`;

    // Create booking with calculated duration
    const newBooking = await Booking.create({
      userId,
      publicId,
      noOfUsers,
      startTime,
      endTime,
      duration: durationInHours,
    });

    res.status(200).json({
      success: true,
      message: "Booking created successfully",
      content: {
        data: newBooking,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { publicId } = req.body;
    let { startTime, endTime } = req.body.data;

    if (!publicId) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "publicId",
            message: "Please provide a valid booking ID",
            code: "INVALID_ID",
          },
        ],
      });
    }

    const bookingRecord = await Booking.findOne({ where: { publicId } });

    if (!bookingRecord) {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
        code: "NOT_FOUND",
      });
    }

    if (startTime !== null && typeof startTime !== "undefined") {
      startTime = new Date(startTime);
      // Validate start and end time format
      if (isNaN(startTime.getTime())) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              param: "startTime",
              message: "Invalid start time format",
              code: "INVALID_INFO",
            },
          ],
        });
      }
      bookingRecord.startTime = startTime;
    }

    if (endTime !== null && typeof endTime !== "undefined") {
      endTime = new Date(endTime);
      // Validate end time format
      if (isNaN(endTime.getTime())) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              param: "endTime",
              message: "Invalid end time format",
              code: "INVALID_INFO",
            },
          ],
        });
      }
      bookingRecord.endTime = endTime;
    }

    // Validate start time before end time
    if (bookingRecord.startTime >= bookingRecord.endTime) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            message: "Start time must be before end time",
            code: "INVALID_INFO",
          },
        ],
      });
    }

    await bookingRecord.save();

    res.status(200).json({
      success: true,
      message: "Booking upated successfully",
      content: {
        data: bookingRecord,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleBooking = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "publicId",
            message: "Please provide a valid booking ID",
            code: "INVALID_ID",
          },
        ],
      });
    }

    const bookingRecord = await Booking.findOne({ where: { publicId } });

    if (!bookingRecord) {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
        code: "NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      content: {
        data: bookingRecord,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { publicId } = req.query;

    if (!publicId) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "publicId",
            message: "Please provide a valid booking ID",
            code: "INVALID_ID",
          },
        ],
      });
    }

    const bookingRecord = await Booking.findOne({ where: { publicId } });

    if (!bookingRecord) {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
        code: "NOT_FOUND",
      });
    }

    bookingRecord.deletedAt = new Date();
    await bookingRecord.save();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      content: {
        data: bookingRecord,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { sort = "createdAt:DESC", page = 1, limit = 10 } = req.query;

    const filter = {};

    if (req.user.role === "user") {
      filter.userId = req.user.id;
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

    res.status(200).json({
      success: true,
      content: {
        data: bookings.rows, // Extract bookings data
        meta: {
          sort,
          page,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
