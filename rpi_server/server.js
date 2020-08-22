const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 7000;
const server = http.createServer(app);
const SerialPort = require('SerialPort');
const Readline = require('@serialport/parser-readline')
const textToSpeech = require('./text2speech/text2Speech');
server.listen(port);
const axios = require('axios');
var waitingForArduino = false;
var messages = null;
var nextMessage = null;

// Set the serial port
const arduino = new SerialPort('/dev/cu.usbserial-14320', {
    baudRate: 115200,
    autoOpen: false
});

const parser = arduino.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', function (data) {
    console.log(data);
    if (data === 'hugging') {
        if (nextMessage) {
            nextMessage.hasPlayed = 'true';
            axios.post('http://localhost:8000/products/bearwithme', nextMessage)
                .then(function (response) {
                    console.log(response.data.message);
                    nextMessage = null;
                    waitingForArduino = false;
                })
                .catch(function (error) {
                    console.log(error);
                });

        }
    }

})

arduino.open(function (err) {
    if (err) {
        return console.log("Error opening port: ", err.message);
    }
});

// Gets current messages from mongodb 
const updateStatus = () => {
    axios.get('http://localhost:8000/products/bearwithme/hasPlayed/false')
        .then((res) => {
            messages = res.data;
            setNextMessage();
        })
        .catch((error) => {
            console.error(error)
        })
}

const setNextMessage = () => {
    nextMessage = messages[Object.keys(messages)[0]] || null;
    if (nextMessage) {
        arduino.write("1");
        waitingForArduino = true;
    }
}

setInterval(function () {
    console.log("Waiting for Arduino: ", waitingForArduino);
    console.log("Message in queue: ", nextMessage);
    if (!waitingForArduino) {
        updateStatus();
    }
}, 5000);