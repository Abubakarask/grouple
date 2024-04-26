let userId;
let roomId;
let currentBooking = [];

const getUserId = () => {
  const userDataString = window.localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);

  if (userData && userData.id) {
    userId = userData.id;
  } else {
    alert("Please login first");
    window.location.href = "../index.html";
  }
};

// Connect to the socket server
const socket = io();

socket.on("connect", () => {
  roomId = socket.id;
  console.log(`Connected to server with id ${roomId}`);
});

// Function to display bookings in the UI
function displayBookings(bookings) {
  const container = document.getElementById("bookings-container");
  container.innerHTML = ""; // Clear existing content

  bookings.forEach((booking) => {
    const bookingElement = document.createElement("div");
    bookingElement.classList.add("booking-list");

    // Display booking details (replace with your actual data fields)
    bookingElement.innerHTML = `
      <h3>Booking ID: ${booking.publicId}</h3>
      <p>Start Time: ${new Date(booking.startTime).toLocaleString()}</p>
      <p>End Time: ${new Date(booking.endTime).toLocaleString()}</p>
      <p>Number of Users: ${booking.noOfUsers}</p>
    `;

    container.appendChild(bookingElement);
  });
}

// Event listener for successful booking retrieval
socket.on("bookings", (data) => {
  console.log("Booking data received:", data);
  if (data.success) {
    console.log("Triggering Bookings");
    currentBooking = data.content.data;
    // Extract bookings data
    displayBookings(data.content.data);
  } else {
    console.error("Error fetching bookings:", data.message);
  }
});

socket.on("update-bookings", (user) => {
  if (parseInt(user) === userId) {
    socket.emit("bookings", userId);
  }
});

getUserId();
// Send a request to get all bookings on page load
socket.emit("bookings", userId);
socket.emit("add-to-active-users", roomId, userId);
