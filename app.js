const booking = require('./models/booking');

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    Mongoose = require('mongoose'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),


    User = require('./models/user'),
    Flight = require('./models/flight'),
    Airport = require('./models/airport'),
    Booking = require('./models/booking'),
    Contact = require('./models/contact'),
    Traveller = require('./models/traveller'),
    indexRoutes = require('./routes/index'),
    flightsRoutes = require('./routes/flight'),
    managerRoutes = require('./routes/manager')

    // seedDB = require('./seeds');

// seedDB();

app.use(express.static('public'));
app.use(express.static('javascript'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

Mongoose.connect('mongodb://localhost/DogeAir', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(require('express-session')({
    secret: 'secret is always secret.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(

    // Change defalt username to email
    {
        usernameField: 'email',
    },
    User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success')
    next();
});

app.use('/', indexRoutes);

app.use('/flight', flightsRoutes);

app.use('/manager', managerRoutes);


app.post('/flight/:id/booking', function (req, res) {
    var flightid = req.body.flightid;
    var departDate = req.body.departDate;
    var seat = req.body.seat;
    if (req.isAuthenticated()) {
        var booker_id = req.user._id,
            booker_username = req.user.firstname;
    }

    var bookinfo =
    {
        departDate: departDate,
        seat: seat,
        booker: {
            id: booker_id,
            username: booker_username
        },
        flight: flightid

    };

    Flight.findOne({ _id: flightid }).populate("airlineName from to").exec(function (err, flightbooked) {
        if (err) {
            console.log(err);
        } else {
            // console.log("flight booked");
            // console.log(flightbooked);
            Booking.create(bookinfo, function (err, newbooking) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log("after create booking");
                    // console.log(newbooking);
                    // console.log("flight booked2");
                    // console.log(flightbooked);

                    res.render("booking.ejs", { flight: flightbooked, booked: newbooking });
                }

            });
        }

    });

});

app.post('/flight/:id/payment', function (req, res) {

    var booking_id = req.body.booked_id

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

    Contact.create(contactinfo, function (err, newcontact) {
        if (err) {
            console.log(err);
        } else {
            console.log("Contact created")
            console.log(newcontact);
            console.log(newcontact._id);

            Booking.findById(booking_id, async function (err, booking_result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("book result")
                    console.log(booking_result);
                    console.log("book seat")
                    console.log(booking_result.seat);
                    console.log("book contact id save")
                    Booking.update(
                        { _id: booking_result._id },
                        { $set: { contact: newcontact._id } }
                        , function (err, bookingUpdate) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("book result after contact")
                                console.log(bookingUpdate);
                            
                            }
                        });
                 

                    var travelers_title = req.body.traveler_title;
                    var travelers_firstname = req.body.traveler_firstname;
                    var travelers_lastname = req.body.traveler_lastname;
                    var travelers_birthdate = req.body.traveler_birthdate;
                    var travelers_nationallity = req.body.traveler_nationallity;
                    var travelers_passportnumber = req.body.traveler_passportnumber;
                    var travelers_passportdate = req.body.traveler_passportdate;
                    console.log("Travelers title")
                    console.log(travelers_title);
                    for (let index = 0; index < booking_result.seat; index++) {
                        var traveler_title = travelers_title[index]
                        var traveler_firstname = travelers_firstname[index]
                        var traveler_lastname = travelers_lastname[index]
                        var traveler_birthdate = travelers_birthdate[index]
                        var traveler_nationallity = travelers_nationallity[index]
                        var traveler_passportnumber = travelers_passportnumber[index]
                        var traveler_passportdate = travelers_passportdate[index]
                        console.log("Traveler title")
                        console.log(traveler_title);

                        var tarveler_info = {
                            title: traveler_title,
                            firstname: traveler_firstname,
                            lastname: traveler_lastname,
                            birthdate: traveler_birthdate,
                            nationality: traveler_nationallity,
                            passportnum: traveler_passportnumber,
                            passportexp: traveler_passportdate
                        }

                        Traveller.create(tarveler_info, function (err, newtraveler) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Traveler " + index + " Create")
                                console.log(newtraveler);
                                // booking_result.travellers.push(newtraveler);
                                // booking_result.update({travellers:newtraveler});
                                Booking.update(
                                    { _id: booking_result._id },
                                    { $push: { travellers:newtraveler } }
                                 , function (err, bookingUpdate) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Updated")
                                        console.log(bookingUpdate);
                                    
                                    }
                                });
                                // console.log("book result after add")
                                // console.log(booking_result);
                                
                            }

                        });

                    }
                    console.log("Booking has been updated")
                }
            });

            res.render("payment/payment.ejs");
        }
    });
});

app.get('/flight/payment/confirm', function (req, res) {
    res.render("payment/payment-confirm.ejs")
});


app.get('/flight/payment/done', function (req, res) {
    res.render("payment/payment-done.ejs")
});





app.get('*', function (req, res) {
    res.send('Bad request.')
})

app.listen('3000', function (req, res) {
    console.log('Server is running');
});
