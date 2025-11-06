const socket = io();

const form = document.getElementById("send-container");
const messageInp = document.getElementById("messageInp");
const messageContainer = document.getElementById("messageContainer");

const name = prompt("Enter your name to join:");
socket.emit("new-user-joined", name);

const appendMessage = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message", position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

socket.on("user-joined", name => {
    appendMessage(`${name} joined the chat`, "center");
});

socket.on("Welcome", name => {
    appendMessage(`Welcome ${name}`, "center");
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInp.value;
    appendMessage(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInp.value = "";
});

socket.on("receive", data => {
    appendMessage(`${data.name}: ${data.message}`, "left");
});

socket.on("left", name => {
    appendMessage(`${name} left the chat`, "center");
});
