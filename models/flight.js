var mongoose = require('mongoose');



var flightSchema = new mongoose.Schema({
    flightID: String,
    airlineName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airline'
    },
    departTime: String,
    arriveTime: String,
    totalTime: Number,
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
        entertain: { type: Boolean, default: false},
        meal: { type: Boolean, default: false},
        wifi: { type: Boolean, default: false},
        usb: { type: Boolean, default: false}
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

