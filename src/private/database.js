const { MongoClient } = require("mongodb");

class Database extends MongoClient {
    constructor(url) {
        super(url);
        this.connectedDB = null;
        this.connectDB();
    }
    // Returns a promise that resolves to return the connected database.
    dbPromise() {
        var self = this;
        return new Promise(function (res, rej) {
            // Connect to MongoDB
            async function connectToDB() {
                try {
                    await self.connect();
                    console.log("Connected correctly to server");
                    MongoClient.connect(url, function (err, db) {
                        if (err) throw err;
                        res(db);
                    });
                } catch (err) {
                    console.log(err.stack);
                }
                finally {
                    await self.close();
                }
            }
            connectToDB().catch(console.dir);
        });
    }
    connectDB() {
        let self = this;
        this.dbPromise().then(function (db) { self.connectedDB = db });
    }
}

const url = "mongodb+srv://bearwithme:iVrATsbtMaNe58r@iot-dewy.80yug.mongodb.net/iot.bearWithMe?retryWrites=true&w=majority";
let dbClient = new Database(url);

module.exports = dbClient;