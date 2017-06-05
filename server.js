const express = require('express')
const SocketServer = require('ws').Server;

const PORT = 3001;

const server = express()

  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

let numberOfUsers = 0; // Counts the number of users online

function broadcastCount() { // Broadcasts the count to app.js
    var userCount= {
        type: "count",
        number: numberOfUsers
      }
      // Broadcast to all.
      wss.clients.forEach(function each(client) {
         if (client.readyState === WebSocket.OPEN) {
            console.log('sent:', userCount);
           client.send(JSON.stringify(userCount));
         }
       });
}

wss.on('connection', (ws) => {
    numberOfUsers += 1 // Adds one to the count of users
    console.log("numberOfUsers:", numberOfUsers);
    console.log('Client connected');
    broadcastCount(); // Calls the function (above) to braodcast the count

      ws.on('close', () => {
        numberOfUsers -= 1 // Minus one from the count of users
        console.log("numberOfUsers two:", numberOfUsers)
        broadcastCount(); // Calls the function (above) to braodcast the count
      })
  });

const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received:', message);
    var jsonmessage = JSON.parse(message);
    console.log(jsonmessage);
    switch (jsonmessage.type) {
      case "postmessage":
      var clientmessage = {
        type: "message",
        username: jsonmessage.newUsername ? " " : jsonmessage.username,
        content: jsonmessage.newUsername ?
        `${jsonmessage.username} changed their name to ${jsonmessage.newUsername}` :
        jsonmessage.content,
      }
      // Broadcast to all.
      wss.clients.forEach(function each(client) {
         if (client.readyState === WebSocket.OPEN) {
            console.log('sent:', clientmessage);
           client.send(JSON.stringify(clientmessage));
         }
       });
      break
      default:
      break
    }

  });




});
