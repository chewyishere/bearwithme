const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 7000;
const server = http.createServer(app);
const SerialPort = require('SerialPort');
const textToSpeech = require('./text2speech/text2Speech');
server.listen(port);
const axios = require('axios');
var messages = [];

// // Set the serial port
// const serialPort = new SerialPort('/dev/cu.usbmodem142301', {
//     baudRate: 9600
// });

const getStatus = () => {
    axios.get('http://localhost:8000/products/bearwithme')
        .then((res) => {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (!d.played) {
                    messages.length = 0;
                }
            }
            // serialPort.write(data);
        })
        .catch((error) => {
            console.error(error)
        })
}

setInterval(function () {
    // getStatus();
    axios.post('http://localhost:8000/products/bearwithme', {
        firstName: 'Fred',
        lastName: 'Flintstone',
        msg: "I hope things look up for you soon."
    })
        .then(function (response) {
            console.log(response.data.message);
        })
        .catch(function (error) {
            console.log(error);
        });
}, 15000);

