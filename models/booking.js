var mongoose = require('mongoose');


var bookingSchema = new mongoose.Schema({
    bookingID:String,
    departDate:String,
    returnDate:String,
    seat:Number,
    booker:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username:{
            type: String,
        } 
    },
    flight:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight'
    },
    contact:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    travelers:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Traveler'
        }
    ],

    paymentstatus:{
        type:String,
        default: "Waiting for payment"
    }

});

module.exports = mongoose.model('Booking', bookingSchema)

