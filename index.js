const express = require("express");
const app = express();
const http = require("https").createServer(app);
const io = require("socket.io")(https, {
  cors: {origin: "*"}
});

app.use(express.static(__dirname));

const users = {};
io.on("connection", socket => {
  console.log("A user connected");
  socket.on("new-user-joined", name => {
    users[socket.id] = name;
    socket.emit("Welcome", name);
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", msg => {
    socket.broadcast.emit("receive", { message: msg, name: users[socket.id] });
  });
  socket.on("disconnect", () => {
    const name = users[socket.id];
    if (name) io.emit("left", name);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 8000;
https.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
