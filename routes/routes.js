const express = require("express");
const { signup, signin, myProfile, signout } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");
const {
  createBooking,
  updateBooking,
  getSingleBooking,
  getAllBookings,
  deleteBooking,
} = require("../controllers/booking");

const router = new express.Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Server is working:).....",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//User APIs
router.route("/auth/signup").post(signup);
router.route("/auth/signin").post(signin);
router.route("/auth/me").get(isAuthenticated, myProfile);
router.route("/auth/signout").get(isAuthenticated, signout);

//Booking APIs
router.route("/booking/create").post(isAuthenticated, createBooking);
router.route("/booking/update").post(isAuthenticated, updateBooking);
router.route("/booking/:publicId").get(isAuthenticated, getSingleBooking);
router.route("/booking/delete").post(isAuthenticated, deleteBooking);
router.route("/bookings/list").get(isAuthenticated, getAllBookings);

module.exports = router;
