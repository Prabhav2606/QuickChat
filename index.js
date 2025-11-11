const express = require("express");
const app = express();
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
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
http.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
