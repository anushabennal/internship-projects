const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

let users = {}; // socket.id -> username

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // User sets username
    socket.on("setUsername", (username) => {
        users[socket.id] = username;
        console.log("Users:", users);

        // Send updated user list to all clients
        io.emit("userList", users);
    });

    // Private message
    socket.on("privateMessage", ({ to, message }) => {
        if (users[to]) {
            io.to(to).emit("privateMessage", {
                from: users[socket.id],
                message,
            });
        }
    });

    // On disconnect
    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("userList", users);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
