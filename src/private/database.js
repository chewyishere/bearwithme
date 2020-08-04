const { MongoClient } = require("mongodb");
const url = "mongodb+srv://bearwithme:whatwouldyoudoifyoursonwasathome@iot-dewy.80yug.mongodb.net/iot.bearWithMe?retryWrites=true&w=majority";
const client = new MongoClient(url);

let databasePromise = new Promise(function (res, rej) {
    // Connect to MongoDB
    async function connectToDB() {
        try {
            await client.connect();
            console.log("Connected correctly to server");
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                res(db);
            });
        } catch (err) {
            console.log(err.stack);
        }
        finally {
            await client.close();
        }
    }
    connectToDB().catch(console.dir);
});

module.exports = databasePromise;