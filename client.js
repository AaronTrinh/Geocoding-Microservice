// Geocoding Client
// Aaron Trinh
// Sample client for the Geocoding microservice.
// Code based on Hello World function from ZeroMQ guide.
// https://zguide.zeromq.org/docs/chapter1/

const zmq = require('zeromq');

// Socket to talk to the server.
console.log("Connecting to Geocoding server...");
const requester = zmq.socket('req');

// Send request to server.
// String: Can be an address, zip code, city, etc.
// This can be modified to send a variable holding the zip code entered by the user.
requester.send("97331");

// Receive reply from the server.
// Currently outputs the response to the console.
// Can be modified to save the result to a variable.
let result;
requester.on("message", function (reply) {
  console.log("Received reply", ": [", reply.toString(), ']');
  result = reply.toString();
});

// Set up server connection.
requester.connect("tcp://localhost:5555");

// Signal to end server.
process.on('SIGINT', function () {
  requester.close();
});
