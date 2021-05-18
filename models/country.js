var mongoose = require('mongoose');


var countrySchema = new mongoose.Schema({
    country:String,
    city:String
});

module.exports = mongoose.model('Country', countrySchema)

