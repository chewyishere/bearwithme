const http = require('http');
const app = require('./app');
const socketIO = require('socket.io');
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketIO(server);
server.listen(port);
var database = null;
var databasePromise = require('./database');
databasePromise.then(function (db) {
    database = db;
})


// Handle Socket Events
io.on('connection', function (socket) {
    socket.on('new hug', function (data) {
        if (!database) {
            console.log("nodb");
            socket.emit('err', "Database is not running");
        } else {
            var dbo = database.db("IOT");
            dbo.collection("bearWithMe").insertOne(data, function (err, res) {
                if (err) throw err;
            });
        }
    })
});

