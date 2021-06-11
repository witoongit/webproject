
var express = require('express'),
    Mongoose = require('mongoose'),
    router = express.Router(),
    Flight = require('../models/flight'),
    Airport = require('../models/airport'),
    Airline = require('../models/airline')


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

    console.log(searchData);

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

            // Check if there's no result found
            if (flights.length == 0) {
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

            console.log(searchData);

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
            console.log("in search round trip");
            console.log(flightQuery);

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
            // console.log('Here is the Airport id');
            // console.log(airport_id);
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

            console.log('Here is the search data');
            console.log(searchData);

            var query;
            if (sort_type === "cost_low") {
                console.log("in cost low sort")
                query = { flightCost: 1 }
            }
            else if (sort_type === "cost_high") {
                console.log("in cost high sort")
                query = { flightCost: -1 }
            }
            else if (sort_type === "flight_low") {
                console.log("in else sort")
                query = { totalTime: 1 }
            }
            else if (sort_type === "flightt_high") {
                console.log("in else sort")
                query = { totalTime: -1 }
            }

            console.log('Here is the flightQuery');
            console.log(flightQuery);

            Flight.find(flightQuery).sort(query).populate("airlineName from to").exec(function (err, flights) {
                if (err) {
                    console.log(err);
                }
                else {

                    flights.forEach(flight => {
                        searchData.to = flight.to.city;
                    });

                    // Check if there's no result found
                    if (flights.length == 0) {
                        console.log("Flight result");
                        console.log(flights);
                    }

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

    // console.log("Booking info")
    // console.log(bookinfo)

    Flight.findOne({ _id: flightid }).populate("airlineName from to").exec(function (err, flight) {
        if (err) {
            console.log(err);
        }
        else {

            // console.log("Flight result");
            // console.log(flight)
            res.render("flight/flight-confirm.ejs", { flights: flight, bookinfo })
        }
    });
});

module.exports = router;