
var express = require('express'),
    router = express.Router(),
    Flight = require('../models/flight'),
    User    = require('../models/user'),
    Airport = require('../models/airport'),
    Booking = require('../models/booking')


router.get('/', function (req, res) {
    Airport.find({}, function (err, airport_result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("flight/flight.ejs", { airports: airport_result })
        }
    });
});

router.post('/search', function (req, res) {

    var flightclass = req.body.flightclass;
    var from = req.body.from;
    var to = req.body.to;
    var departDate = req.body.departDate;
    var returnDate = req.body.returnDate;
    var seat = req.body.seat
    var roundtrip_flag;
    var info_flag = true;


    // Check for roundtrip or oneway by return date
    if (returnDate !== undefined) {
        roundtrip_flag = true
    } else {
        roundtrip_flag = false
    }

    var searchData =
    {
        flightclass: flightclass,
        from: from,
        to: to,
        departDate: departDate,
        returnDate: returnDate,
        seat: seat,
        flag1: roundtrip_flag,
        flag2: info_flag
    };


    var flightQuery
    if (flightclass !== "all") {
        flightQuery = {
            flightclass: flightclass,
            from: from,
            to: to
        }
    } else {
        flightQuery = {
            from: from,
            to: to
        }
    }


    Flight.find(flightQuery).populate("airlineName from to").exec(function (err, flights) {
        if (err) {
            console.log(err);
        }
        else {
            flights.forEach(flight => {
                searchData.to = flight.to.city;
            });

            
            
            if (from == to){
                req.flash('error', 'Departure and Destination(from, to) can not be the same loacation.')
                res.redirect('/flight');
                // Check if there's no result found
            } else if (flights.length == 0) {
                req.flash('error', 'flight not found.')
                res.redirect('/flight');
                // Check if departure date is late then return date
            } else if (returnDate < departDate) {
                req.flash('error', 'departure date is late then return date.')
                res.redirect('/flight');
            } else {
                res.render("flight/flights-list.ejs", { flights: flights, searchData })
            }


        }
    });
});

router.post('/:id/search_roundtrip', function (req, res) {


    var flightclass = req.body.flightclass;
    var from = req.body.to;
    var to = req.body.from;
    var departDate = req.body.departDate;
    var returnDate = req.body.returnDate;
    var seat = req.body.seat
    var roundtrip_flag = false;
    var info_flag = false;
    Airport.findOne({ city: from }, function (err, airport) {
        if (err) {
            console.log(err)
        } else {
            let airport_id = airport._id

            var searchData =
            {
                flightclass: flightclass,
                from: from,
                to: to,
                departDate: departDate,
                returnDate: returnDate,
                seat: seat,
                flag1: roundtrip_flag,
                flag2: info_flag
            };


            var flightQuery
            if (flightclass !== "" && flightclass !== undefined) {
                flightQuery = {
                    flightclass: flightclass,
                    from: airport_id,
                    to: to
                }
            } else {
                flightQuery = {
                    from: airport_id,
                    to: to
                }
            }

            Flight.find(flightQuery).populate("airlineName from to").exec(function (err, flights) {
                if (err) {
                    console.log(err);
                }
                else {
                    flights.forEach(flight => {
                        searchData.to = flight.to.city;
                    });

                    res.render("flight/flights-list.ejs", { flights: flights, searchData })

                }
            });
        }
    })
});

router.post('/sort', function (req, res) {

    var sort_type = req.body.sort_type;
    var flightclass = req.body.flightclass;
    var from = req.body.from;
    var to = req.body.to;
    var departDate = req.body.departDate;
    var returnDate = req.body.returnDate;
    var seat = req.body.seat

    Airport.findOne({ city: to }, function (err, airport) {
        if (err) {
            console.log(err)
        } else {
            let airport_id = airport._id

            var searchData =
            {
                flightclass: flightclass,
                from: from,
                to: to,
                departDate: departDate,
                returnDate: returnDate,
                seat: seat,
            };


            var flightQuery
            if (flightclass !== "all" && flightclass !== undefined) {
                flightQuery = {
                    flightclass: flightclass,
                    from: from,
                    to: airport_id
                }
            } else {
                flightQuery = {
                    from: from,
                    to: airport_id
                }
            }

            var query;
            if (sort_type === "cost_low") {
                query = { flightCost: 1 }
            }
            else if (sort_type === "cost_high") {
                query = { flightCost: -1 }
            }
            else if (sort_type === "flight_low") {
                query = { totalTime: 1 }
            }
            else if (sort_type === "flightt_high") {
                query = { totalTime: -1 }
            }

            Flight.find(flightQuery).sort(query).populate("airlineName from to").exec(function (err, flights) {
                if (err) {
                    console.log(err);
                }
                else {

                    flights.forEach(flight => {
                        searchData.to = flight.to.city;
                    });

                    res.render("flight/flights-list.ejs", { flights: flights, searchData, flightclass })
                }
            });
        }
    });


});

router.post('/:id/confirm', function (req, res) {
    var flightid = req.body.flightid;
    var departDate = req.body.departDate;
    var seat = req.body.seat
    var bookinfo =
    {
        departDate: departDate,
        seat: seat,
    };


    Flight.findOne({ _id: flightid }).populate("airlineName from to").exec(function (err, flight) {
        if (err) {
            console.log(err);
        }
        else {

            res.render("flight/flight-confirm.ejs", { flight: flight, bookinfo })
        }
    });
});

router.post('/:id/booking', function (req, res) {
    var flightid = req.params.id;
    var departDate = req.body.departDate;
    var seat = req.body.seat;

    if (req.isAuthenticated()) {
        console.log("Is a user")
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

    console.log(flightid)

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


                    if (req.isAuthenticated()) {
                    console.log("Is a user 2")
                    User.updateOne(
                        { _id: req.user._id },
                        { $set: { current_booking: newbooking._id } }
                        , function (err, bookingUpdate) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log("book result after contact")
                                // console.log(bookingUpdate);
                                res.render("flight/flight-booking.ejs", { flight: flightbooked, booked: newbooking });
                            }
                        });
                    } else {
                        res.render("flight/flight-booking.ejs", { flight: flightbooked, booked: newbooking });
                    }
                    // console.log("after create booking");
                    // console.log(newbooking);
                    // console.log("flight booked2");
                    // console.log(flightbooked);
                   
                }

            });
        }

    });

});

module.exports = router;