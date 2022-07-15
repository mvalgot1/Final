const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser } = require("./utils/users");

const io = new Server(server);

app.get("/", (req, res) => {
    res.send("This is Whiteboard project backend");
});

let roomIdGlobal, imgURLGlobal;
let userMap = new Map();
io.on("connection", (socket) => {
    socket.on("userJoined", (data) => {
        const {name, userId, roomId, host, presenter} = data;
        roomIdGlobal = roomId;
        socket.join(roomId);
        const users = addUser(data);
        socket.emit("userIsJoined", {success: true, users});
        socket.broadcast.to(roomId).emit("allUsers", users);
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
            imgURL: imgURLGlobal,
            ishost: presenter,
        })
    });
    socket.on("whiteboardData", (data) => {
        imgURLGlobal = data.imgurl;
        userMap.set(data.uid, data.imgurl);
        console.log(Array(userMap.keys()));
        console.log((Array.from(userMap)).length);
        socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
            imgURL: data.imgurl,
            ishost: data.ishost,
            imgMap: Array.from(userMap),
        })
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => 
    console.log("server is running on http://localhost:5000")
);
