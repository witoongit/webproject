var mongoose = require('mongoose');



var flightSchema = new mongoose.Schema({
    flightID: String,
    airlineName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airline'
    },
    departTime: String,
    arriveTime: String,
    maxseat: Number,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airport'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airport'
    },
    flightCost: Number,
    flightclass: String,
    classdetail: {
        baggage: Number,
        seatselect: Boolean,
        entertain: Boolean,
        meal: Boolean,
        usb: Boolean
    },
    stop: Number,
    stoplocation: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Airport'
        }
    ]
});

module.exports = mongoose.model('Flight', flightSchema)

