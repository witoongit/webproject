var mongoose = require('mongoose');


var airlineSchema = new mongoose.Schema({
    name:String,
    icon:String
});

module.exports = mongoose.model('Airline', airlineSchema)

