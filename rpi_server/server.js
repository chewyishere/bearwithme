const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 7000;
const server = http.createServer(app);
const SerialPort = require('SerialPort');
server.listen(port);
const axios = require('axios')
let lastDir = 0;
let dir = 0;

// Set the serial port
const serialPort = new SerialPort('/dev/cu.usbmodem142301', {
    baudRate: 9600
});

const getStatus = () => {
    axios.get('http://localhost:8000/products/mamas-boy')
        .then((res) => {
            // console.log(`statusCode: ${res.statusCode}`)
            dir = res.data.dir.toString();
            console.log(dir.toString());
            if (lastDir != dir) {
                serialPort.write(dir);
                lastDir = dir;
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

setInterval(getStatus, 1000 / 30);

