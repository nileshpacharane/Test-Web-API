const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoDBConnect = require('./config/mongodb.config');

const userRoute = require('./route/users.route');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

mongoDBConnect();
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoute)

module.exports = app;