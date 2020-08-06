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
    dbo.collection(id).insertOne(body, function (error, results) {
        try {
            if (error) throw error;
            else {
                res.status(200).json({
                    message: 'posted to database',
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    })

})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'bearwithme') {
        var dbo = dbClient.connectedDB.db("IOT");
        let arr = dbo.collection("bearwithme").find().toArray();
        arr.then(function (result) {
            res.status(200).json(result)
        })
    }
})

module.exports = router;