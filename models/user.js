var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new mongoose.Schema({
    username:String,
    title:String,
    firstname: String,
    lastname: String,
    phonenumber: String,
    email: String,
    password: String,
    tier: {
        type:String,
        default:"Member"
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)

