var mongoose = require('mongoose');


var bookingSchema = new mongoose.Schema({

    departDate:String,
    seat:Number
    
});

module.exports = mongoose.model('Booking', bookingSchema)

