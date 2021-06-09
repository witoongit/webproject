var mongoose = require('mongoose');


var airportSchema = new mongoose.Schema({
    name:String,
    country:String,
    city:String
});

module.exports = mongoose.model('Airport', airportSchema)

