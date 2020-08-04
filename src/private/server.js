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
            console.log("nodb");
            socket.emit('err', "Database is not running");
        } else {
            var dbo = dbClient.connectedDB.db("IOT");
            dbo.collection("bearWithMe").insertOne(data, function (err, res) {
                try {
                    if (err) throw (err);
                } catch (err) {
                    console.log(err);
                }
            });
        }
    })
});

