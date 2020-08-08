const http = require('http');
const app = require('./app');
const socketIO = require('socket.io');
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketIO(server);
server.listen(port);
const dbClient = require('./database');

// Handle Socket Events
io.on('connection', function (socket) {
    socket.on('new hug', function (data) {
        if (!dbClient.connectedDB) {
            socket.emit('err', "Database is not connected, cannot add");
        } else {
            var dbo = dbClient.connectedDB.db("IOT");
            dbo.collection("bearwithme").insertOne(data, function (err, res) {
                try {
                    if (err) throw (err);
                } catch (err) {
                    console.log(err);
                }
            });
        }
    });

    socket.on('get hugs', function () {
        if (!dbClient.connectedDB) {
            socket.emit('err', "Database is not connected, cannot add");
        } else {
            var dbo = dbClient.connectedDB.db("IOT");
            var hugs = dbo.collection("bearwithme").find().toArray();
            hugs.then(function (hugs) {
                socket.emit('hugs', hugs);
            });
        }
    });

});

