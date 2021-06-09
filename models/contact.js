var mongoose = require('mongoose');


var contactSchema = new mongoose.Schema({
    title:String,
    firstname: String,
    lastname: String,
    phonenumber: String,
    email: String,
});

module.exports = mongoose.model('Contact', contactSchema)

