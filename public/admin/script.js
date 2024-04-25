const socket = io("http://localhost:3600");

const roomListContainer = document.getElementById("room-list-container");
const roomList = document.getElementById("room-list");
const messageContainer = document.getElementById("message-container");
const messages = document.getElementById("messages");
const currentRoomLabel = document.getElementById("current-room");
const messageInput = document.getElementById("message-input");
const sendMessageButton = document.getElementById("send-message");
let currentRoomId;

// Function to update and display the list of active rooms
function updateRoomList(activeRooms) {
  roomList.innerHTML = "";
  for (const roomId in activeRooms) {
    if (roomId !== socket.id) {
      const listItem = document.createElement("li");
      listItem.textContent = roomId;
      listItem.addEventListener("click", () => {
        joinRoom(roomId, activeRooms);
      });
      roomList.appendChild(listItem);
    }
  }
}

// Function to join a room and update UI
function joinRoom(roomId, activeRooms) {
  socket.emit("join-room", roomId);
  currentRoomId = roomId;
  currentRoomLabel.textContent = `Current Room: ${roomId}`;
  messages.innerHTML = ""; // Clear previous messages

  // Display chat history for the room
  if (activeRooms[roomId]) {
    activeRooms[roomId].forEach((message) => {
      const messageElement = document.createElement("p");
      messageElement.textContent = message;
      messages.appendChild(messageElement);
    });
    messages.scrollTop = messages.scrollHeight; // Auto-scroll to latest message
  }
}

// Handle connection and room updates
socket.on("connect", () => {
  isAdmin = true; // Set admin flag

  // Request list of active rooms upon connection
  socket.emit("get-active-rooms");
});

socket.on("active-rooms", (rooms) => {
  updateRoomList(rooms);
});

// Handle received messages and display them for current room
socket.on("admin-message-received", (data) => {
  const { roomId, message } = data;
  if (currentRoomId && currentRoomId === roomId) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight; // Auto-scroll to latest message
  }
});

// Handle sending messages as admin
sendMessageButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message && currentRoomId) {
    socket.emit("new-message", {
      message,
      roomId: currentRoomId,
      isAdmin: true,
    });
    messageInput.value = "";
  }
});

updateRoomList({});
