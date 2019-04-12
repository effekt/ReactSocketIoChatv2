const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const http = require('http');
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 3000;
const Message = require('./server/models/message');
const Log = require('./server/models/log');
//app.use(cors);
app.use(bodyParser.json());
app.use(morgan('short'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.static(path.join(__dirname, 'admin/build')))

/**
 * Connect to MongoDB
 */
mongoose.connect("mongodb+srv://fsUser:5Th8zxE6D7BY96z@cluster0-xjkrx.mongodb.net/test?retryWrites=true")

/**
 * Route configuration in ./server/api/index
 */
require('./server/api')(app);
app.post('/admin/login', (req, res) => {
  res.json({loggedIn: (String(req.body.username).toLowerCase() === 'admin' && req.body.password === 'p@ssw0rd!')})
})
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname + '/admin/build/index.html'))
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/admin/build/index.html'))
})

/**
 * Begin listening for requests
 */
var server = http.createServer(app).listen(port, () => console.log(`Listening on port ${port}`));

/**
 * Socket.io server
 */
io.on('connection', function(sock) {
  sock.on('roomChange', (msg) => {
    sock.nickname = msg.user;
    sock.leave(msg.oldRoom, (err) => {
      Log.addLog(msg.oldRoom ? {by: msg.user, log: 'Left room: ' + msg.user + msg.oldRoom} : null, (res) => {
        sock.to(msg.oldRoom).emit('leave', msg.user);
        sock.join(msg.room, (err) => {
          Log.addLog({by: msg.user, log: 'Joined room: ' + msg.user + msg.room}, (res) => {
            let users = [];
            for (sck in io.sockets.adapter.rooms[msg.room].sockets) {
              users.push(io.in(msg.room).sockets[sck].nickname);
            }
            Message.getMessages(msg.room, (messages) => {
              sock.emit('room', {users: users, messages: messages});
              sock.to(msg.room).emit('join', msg.user);
            });
          });
        });
      });
    });
  });

  sock.on('disconnecting', (msg) => {
    let that = this;
    Log.addLog({by: sock.nickname, log: 'Disconnected: ' + sock.nickname}, (res) => {
      for (r of that.rooms) {
        sock.to(r).emit('dc', sock.nickname);
      }
    });
  })

  sock.on('message', (msg) => {
    Log.addLog({by: sock.nickname, log: 'Sent Message: ' + msg.message}, (res) => {
      sock.to(msg.room).emit('message', msg);
    });
  });
});
io.listen(server);