"use strict"
const WebSocketClient = require('websocket').client,
			client = new WebSocketClient()

let server = {}
server.options = {
  tcp: true,       // false for UDP, true for TCP (default true)
  challenge: true  // true to use the challenge protocol (default true)
}
server.result = {}

const rconFunc = (message,serverQueryString) => {

	server.ip = serverQueryString.split(":")[0],
	server.port = serverQueryString.split(":")[1],
	server.command = 'A2S_INFO'

	client.on('connectFailed', function(error) {
	    console.log('Connect Error: ' + error.toString());
	});

	client.on('connect', function(connection) {
	    console.log('WebSocket Client Connected');
	    connection.on('error', function(error) {
	        console.log("Connection Error: " + error.toString());
	    });
	    connection.on('close', function() {
	        console.log(server.command + ' Connection Closed');
	    });
	    connection.on('message', function(message) {
	        if (message.type === 'utf8') {
	            console.log("Received: '" + message.utf8Data + "'");
	        }
	    });

	    // function sendNumber() {
	    //     if (connection.connected) {
	    //         var number = Math.round(Math.random() * 0xFFFFFF);
	    //         connection.sendUTF(number.toString());
	    //         setTimeout(sendNumber, 1000);
	    //     }
	    // }
	    // sendNumber();
	});

	client.connect('ws://'+server.ip+':'+server.port+'/', server.command);


}


module.exports = {
  get : rconFunc
}
