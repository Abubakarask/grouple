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