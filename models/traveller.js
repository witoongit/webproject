var mongoose = require('mongoose');


var travellerSchema = new mongoose.Schema({
    title:String,
    firstname: String,
    lastname: String,
    birthdate: String,
    nationality: String,
    passportnum: String,
    passportexp: String
    
});

module.exports = mongoose.model('Traveller', travellerSchema)

