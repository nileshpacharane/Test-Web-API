const mongoose = require('mongoose');

const connectionString = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

var connectDB = function () {

    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDb Atlas connected succesfully!!!");
    }).catch(err => {
        console.log("Unable to connect to MongoDb Atlas");
        console.error(err);
    });
}

module.exports = connectDB;