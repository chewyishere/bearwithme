const express = require('express');
const router = express.Router();
var dbClient = require('../../database');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get products'
    })
})

router.post('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const body = req.body;
    var dbo = dbClient.connectedDB.db("IOT");
    try {
        dbo.collection(id).updateOne(
            { id: body.id },
            { $set: { hasPlayed: body.hasPlayed, data: body.data } },
            { upsert: true }
        ).then(function () {
            res.status(200).json({
                data: body,
                message: "Successfully inserted"
            });
        });
    } catch (err) {
        res.status(500).json({
            data: err,
            message: "Error"
        });
    }
    dbClient.close();
})

router.get('/:productId/', (req, res, next) => {
    const id = req.params.productId;
    var dbo = dbClient.connectedDB.db("IOT");
    try {
        let arr = dbo.collection(id).find().toArray();
        arr.then(function (result) {
            res.status(200).json(result)
        })
    } catch (err) {
        res.status(404).json(err);
    }
    dbClient.close();
})

router.get('/:productId/:data/:val/', (req, res, next) => {
    const id = req.params.productId;
    const data = req.params.data;
    const val = req.params.val;
    let option = '{' + "\"" + data + "\"" + ':' + "\"" + val + "\"" + '}';
    option = JSON.parse(option);
    console.log(option)
    var dbo = dbClient.connectedDB.db("IOT");
    try {
        let arr = dbo.collection(id).find(option).toArray();
        arr.then(function (result) {
            res.status(200).json(result)
        })
    } catch (err) {
        res.status(404).json(err);
    }
    dbClient.close();
})

module.exports = router;