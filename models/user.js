var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const booking = require('./booking');


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
    },
    dogepoint: Number,
    current_booking: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)

