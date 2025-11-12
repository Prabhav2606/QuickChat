const socket = io();

const form = document.getElementById("send-container");
const messageInp = document.getElementById("messageInp");
const messageContainer = document.getElementById("messageContainer");

const name = prompt("Enter your name to join:");
socket.emit("new-user-joined", name);

const appendMessage = (message, position, showTime = false) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", position);

  // Create message text span
  const textElement = document.createElement("span");
  textElement.innerText = message;
  messageElement.appendChild(textElement);

  // Add timestamp only if showTime is true
  if (showTime) {
    const timeElement = document.createElement("span");
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    timeElement.innerText = timeString;
    timeElement.classList.add("timestamp");
    messageElement.appendChild(timeElement);
  }

  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

socket.on("user-joined", name => {
    appendMessage(`${name} joined the chat`, "center-green");
});

socket.on("Welcome", name => {
    appendMessage(`Welcome ${name}`, "center-green");
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInp.value;
    appendMessage(`${message}`, "right", true);
    socket.emit("send", message);
    messageInp.value = "";
});

socket.on("receive", data => {
    appendMessage(`${data.name}: ${data.message}`, "left", true);
});

socket.on("left", name => {
    appendMessage(`${name} left the chat`, "center-red");
});
