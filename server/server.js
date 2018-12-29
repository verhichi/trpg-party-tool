const express = require('express');           // import express framework
const app     = express();                    // instantiating express
const http    = require('http');              // import http package
const server  = http.Server(app);             // Create server
const io      = require('socket.io')(server); // set socket.io with server

const portNo  = process.env.PORT || 3000; // set port number

const path = require('path');            // import path object

const bodyParser = require('body-parser');        // import body-parser
app.use(bodyParser.urlencoded({extended: true})); // use body-parser
app.use(bodyParser.json());                       // parse body to json

// Set express listener at port 3000
server.listen(portNo, () => {
  const serverStartTimestamp = new Date().toLocaleString();

  console.log('\n--- SERVER STATUS ---');
  console.log('Server Start Date:', serverStartTimestamp);

  console.log('The Server is up and running!');
  console.log(`Access the website at: http://localhost:${portNo}`);
});

// Set path for file to ./dist
app.use(express.static(path.join(__dirname, '../build')));

// All URL sends user to home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// GET new room id to host a new room
app.get('/newRoomId', (req, res) => {
  let roomId = '';
  do {
    roomId = Math.random().toString().slice(2,10);
  } while(!!io.sockets.adapter.rooms[roomId]);
  res.json({ roomId });
});

// GET check if room id to join exists
app.get('/checkRoomId', (req, res) => {
  console.log(req.query);
  let roomExists = true;
  if(!io.sockets.adapter.rooms[req.query.roomId]){
    roomExists = false;
  }
  res.json({ roomExists });
});

// All URL sends user to home page
app.get('*', (req, res) => {
  res.redirect('/');
});

// Place Holder socket.io logic
io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    console.log('User has disconnected');
  });

  // Logic for when a new user joins the room
  socket.on('join', (roomId, content) => {
    for (let room in socket.rooms){
      socket.leave(room);
    }
    socket.join(roomId);
    socket.to(roomId).emit('join', content);
  });

  // Logic for when a user sends a chat
  socket.on('chat', (roomId, content) => {
    io.to(roomId).emit('chat', content);
  });

  // Logic for when a user creates a new character or edits a character
  socket.on('char', (roomId, content) => {
    io.to(roomId).emit('char', content);
  });

  // Logic for when a user removes a character
  socket.on('delChar', (roomId, charId) => {
    io.to(roomId).emit('delChar', charId);
  });

  // Logic for when a user creates a new character or edits a character
  socket.on('user', (roomId, content) => {
    io.to(roomId).emit('user', content);
  });

  // Logic for when a user creates a new character or edits a character
  socket.on('delUser', (roomId, content) => {
    io.to(roomId).emit('delUser', content);
  });

  // Logic for when a user creates a new enemy or edits an enemy
  socket.on('enemy', (roomId, content) => {
    io.to(roomId).emit('enemy', content);
  });

  // Logic for when a user deletes an enemy
  socket.on('delEnemy', (roomId, content) => {
    io.to(roomId).emit('delEnemy', content);
  });

  // Logic for setting a user as a host
  socket.on('newHost', (roomId, id) => {
    io.to(roomId).emit('newHost', id);
  });

  // Logic for when a user leaves a room
  socket.on('leave', (roomId, id) => {
    io.to(roomId).emit('leave', id);
  });


});
