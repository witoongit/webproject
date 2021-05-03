var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new mongoose.Schema({
    username:String,
    name:String,
    title:String,
    firstname: String,
    lastname: String,
    phonenumber: String,
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)

