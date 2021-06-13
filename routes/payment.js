var express = require('express'),
    router = express.Router(),
    Booking = require('../models/booking'),
    Contact = require('../models/contact'),
    Traveler = require('../models/traveler')

function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
}

router.post('/:book_id', function (req, res) {

    var bookingID = makeid(5); 

    var contact_title = req.body.contact_title
    var contact_firstname = req.body.contact_firstname;
    var contact_lastname = req.body.contact_lastname;
    var contact_phonenumber = req.body.contact_phonenumber;
    var contact_email = req.body.contact_email;

    var contactinfo = {
        title: contact_title,
        firstname: contact_firstname,
        lastname: contact_lastname,
        phonenumber: contact_phonenumber,
        email: contact_email
    }
    console.log(req.params.book_id)

    Contact.create(contactinfo, function (err, newcontact) {
        if (err) {
            console.log(err);
        } else {
            Booking.findById(req.params.book_id, async function (err, booking_result) {
                if (err) {
                    console.log(err);
                } else {
                    Booking.updateOne(
                        { _id: booking_result._id },
                        { $set: { contact: newcontact._id, bookingID: bookingID } }
                        , function (err, bookingUpdate) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log("book result after contact")
                                // console.log(bookingUpdate);
                            
                            }
                        });
                    

                    // console.log("Travelers title")
                    // console.log(travelers_title);
                    if(booking_result.seat == 1){
                        var traveler_title = req.body.traveler_title;
                        var traveler_firstname = req.body.traveler_firstname;
                        var traveler_lastname = req.body.traveler_lastname;
                        var traveler_birthdate = req.body.traveler_birthdate;
                        var traveler_nationallity = req.body.traveler_nationallity;
                        var traveler_passportnumber = req.body.traveler_passportnumber;
                        var traveler_passportdate = req.body.traveler_passportdate;

                        var tarveler_info = {
                            title: traveler_title,
                            firstname: traveler_firstname,
                            lastname: traveler_lastname,
                            birthdate: traveler_birthdate,
                            nationality: traveler_nationallity,
                            passportnum: traveler_passportnumber,
                            passportexp: traveler_passportdate
                        }

                        console.log("1 traveler")
                        console.log(tarveler_info)
                        
                        Traveler.create(tarveler_info, function (err, newtraveler) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(newtraveler);
                                    Booking.updateOne(
                                    { _id: booking_result._id },
                                    { $push: { travelers:newtraveler } }
                                    , function (err, bookingUpdate) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Updated 1 traveler")
                                        console.log(bookingUpdate);
                                    
                                    }
                                });
                                // console.log("book result after add")
                                // console.log(booking_result);
                                
                            }

                        });
                    } else {

                        var travelers_title = req.body.traveler_title;
                        var travelers_firstname = req.body.traveler_firstname;
                        var travelers_lastname = req.body.traveler_lastname;
                        var travelers_birthdate = req.body.traveler_birthdate;
                        var travelers_nationallity = req.body.traveler_nationallity;
                        var travelers_passportnumber = req.body.traveler_passportnumber;
                        var travelers_passportdate = req.body.traveler_passportdate;
    
                        for (let index = 0; index < booking_result.seat; index++) {
                            var traveler_title = travelers_title[index]
                            var traveler_firstname = travelers_firstname[index]
                            var traveler_lastname = travelers_lastname[index]
                            var traveler_birthdate = travelers_birthdate[index]
                            var traveler_nationallity = travelers_nationallity[index]
                            var traveler_passportnumber = travelers_passportnumber[index]
                            var traveler_passportdate = travelers_passportdate[index]

                            var tarveler_info = {
                                title: traveler_title,
                                firstname: traveler_firstname,
                                lastname: traveler_lastname,
                                birthdate: traveler_birthdate,
                                nationality: traveler_nationallity,
                                passportnum: traveler_passportnumber,
                                passportexp: traveler_passportdate
                            }
    
                            Traveler.create(tarveler_info, function (err, newtraveler) {
                                if (err) {
                                    console.log(err);
                                } else {

                                        Booking.updateOne(
                                        { _id: booking_result._id },
                                        { $push: { travelers:newtraveler } }
                                        , function (err, bookingUpdate) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            // console.log("Updated")
                                            // console.log(bookingUpdate);
                                        
                                        }
                                    });
                                    
                                }
    
                            });
    
                        }

                    }
                    res.redirect('/flight/payment/' + booking_result._id)
                }
                
            });       
        }
    });
});


// for juking the async problem
router.get('/:book_id', function (req, res) {
    Booking.findById(req.params.book_id).populate("contact").populate({ path: 'travelers' }).populate({ path: 'flight', populate: [{ path: 'airlineName' }, { path: 'from', select: 'city' }, { path: 'to', select: 'city' }] }).exec(function (err, bookingpop_result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Booking pop");
            console.log(bookingpop_result);
            res.render("payment/payment.ejs", { booking: bookingpop_result });
        }
    });
});

router.post('/:book_id/confirm', function (req, res) {
    var method = req.body.method

    Booking.findById(req.params.book_id).populate("contact").populate({path: 'travelers' }).populate({path: 'flight', populate: [{path: 'airlineName'}, {path: 'from', select: 'city'}, {path: 'to', select: 'city'}]  }).exec(function (err, bookingpop_result) {
        if (err) {
            console.log(err);
        } else {
                    
                    res.render("payment/payment-confirm.ejs", {booking: bookingpop_result, method})
                }     
        
    });
    
});


router.post('/:book_id/done', function (req, res) {
    var method = req.body.method

    Booking.updateOne(
        { _id: req.params.book_id },
        { $set: { paymentstatus: "payment success" } }
        , function (err, bookingUpdate) {
            if (err) {
                console.log(err);
            } else {
                // console.log("book result after contact")
                // console.log(bookingUpdate);
            
            }
        });

    Booking.findById(req.params.book_id).populate("contact").populate({path: 'travelers' }).populate({path: 'flight', populate: [{path: 'airlineName'}, {path: 'from', select: 'city'}, {path: 'to', select: 'city'}]  }).exec(function (err, bookingpop_result) {
        if (err) {
            console.log(err);
        } else {
                    res.render("payment/payment-done.ejs", {booking: bookingpop_result, method})
                }     
        
    });
});





module.exports = router;