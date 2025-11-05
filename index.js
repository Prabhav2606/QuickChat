const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const users = {};

app.use(express.static(__dirname));

io.on("connection", socket => {
    console.log("A user connected");

    socket.on("new-user-joined", name => {
        console.log("New user:", name);
        users[socket.id] = name;
        socket.emit("Welcome", name);
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit("receive", { message: message, name: users[socket.id] });
    });

    socket.on("disconnect", () => {
        const name = users[socket.id];
        if (name) {
            socket.broadcast.emit("left", name);
            console.log("User left:", name);
            delete users[socket.id];
        }
    });
});

http.listen(8001, "0.0.0.0", () => {
    console.log("✅ Server running → http://localhost:8001");
});