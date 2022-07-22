// Geocoding Server
// Aaron Trinh
// Server that accepts addresses and returns the corresponding longitude and latitude.
// Code based on Hello World function from ZeroMQ guide.
// https://zguide.zeromq.org/docs/chapter1/

require('dotenv').config();
const zmq = require('zeromq');
const { Client } = require("@googlemaps/google-maps-services-js");

// Function to make calls to the Google API.
function geocode(location) {
  const args = {
    params: {
      key: process.env.APIKEY, // Google API Key
      address: location,
    }
  };
  const client = new Client();
  client.geocode(args)
    .then((r) => {
      console.log("Successfully located Zip Code!");
      const lng = JSON.stringify(r.data.results[0].geometry.location.lng);
      const lat = JSON.stringify(r.data.results[0].geometry.location.lat);
      const result = lng.concat(", ", lat);
      setTimeout(function () {
        // Sends a reply back to the client.
        // String: "Longitude, Latitude"
        responder.send(result);
      }, 1000);
    })
    .catch((e) => {
      console.log(e.response.data.error_message);
    });
}

// Socket to respond to the client.
const responder = zmq.socket('rep');

// Receive requests from client.
responder.on('message', function (request) {
  console.log("Received Zip Code: [", request.toString(), "]");
  let zipCode = request.toString();
  // Call function to process input and return info to client.
  geocode(zipCode);
});

// Set up server connection.
responder.bind('tcp://*:5555', function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 5555...");
  }
});

// Signal to end server.
process.on('SIGINT', function () {
  responder.close();
});
