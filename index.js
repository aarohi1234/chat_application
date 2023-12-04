// // server.js
// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const app = express();
// app.use(cors());
// const server = http.createServer(app);
// const socketIO = require('socket.io')




// const io = socketIO(server,  {
//   cors: {
//     origin: 'http://localhost:3000', // Replace with your React app's URL
//     methods: ['GET', 'POST'],
//   },
// });;

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Listen for messages from the client
//   socket.on('message', (message) => {
//     console.log('Message:', message);
//     io.emit('message', message); // Broadcast the message to all connected clients
//   });

//   // Clean up when a user disconnects
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// // This should be placed after the socket setup
// app.get("/", (req, res) => {
//   res.send("working");
// });

// const PORT = process.env.PORT || 8081;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 8080; // Provide a default port if not specified

const users = {};

app.use(cors());

app.get("/", (req, res) => {
  res.send("HELLO, IT'S WORKING");
});

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on('joined', ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined `);
    socket.broadcast.emit('userJoined', { user: "Admin", message: `${users[socket.id]} has joined` });
    socket.emit('welcome', { user: "Admin", message: `Welcome to the chat, ${users[socket.id]} ` });
  });

  socket.on('message', ({ message, id }) => {
    io.emit('sendMessage', { user: users[id], message, id });
    console.log({ user: users[id], message, id });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has left` });
    console.log(`User left`);
    delete users[socket.id]; // Remove user from the object on disconnect
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
