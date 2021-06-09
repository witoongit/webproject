var mongoose = require('mongoose');


var bookingSchema = new mongoose.Schema({
    bookingID:String,
    departDate:String,
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
    travellers:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Traveller'
        }
    ],
    paymentstatus:{
        type:String,
        defult: "Waiting for payment"
    }

});

module.exports = mongoose.model('Booking', bookingSchema)

