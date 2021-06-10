var mongoose = require('mongoose');


var travelerSchema = new mongoose.Schema({
    title:String,
    firstname: String,
    lastname: String,
    birthdate: String,
    nationality: String,
    passportnum: String,
    passportexp: String
    
});

module.exports = mongoose.model('Traveler', travelerSchema)

