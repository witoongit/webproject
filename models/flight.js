var mongoose = require('mongoose');
const booking = require('./booking');


var flightSchema = new mongoose.Schema({
    flightID:String,
    airlineName:String,
    departTime:String,
    arriveTime:String,
    from:String,
    to:String,
    flightCost:Number,
    bookings:{
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking'
            }
        ], 
        default: []
    }
});

module.exports = mongoose.model('Flight', flightSchema)

