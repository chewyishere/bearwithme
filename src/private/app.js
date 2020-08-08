const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const productRoutes = require('./api/routes/products');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/json', express.static('/json'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;