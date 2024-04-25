const socket = io("http://localhost:3600");
let roomId;

const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message !== "") {
    sendMessage(message, roomId);
    messageInput.value = "";
  }
});

function sendMessage(message, roomId) {
  // Emit message to server
  socket.emit("new-message", { message, roomId, isAdmin: false });
}

socket.on("connect", () => {
  roomId = socket.id;
  console.log(`Connected to server with id ${roomId}`);
});

// Receive message from server
socket.on("message-received", (message) => {
  const li = document.createElement("li");
  li.textContent = message;
  messages.appendChild(li);
});
