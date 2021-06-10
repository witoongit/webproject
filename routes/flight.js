const { search } = require('./manager');

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


    var searchData =
    {
        flightclass:flightclass,
        from: from,
        to: to,
        departDate: departDate,
        returnDate: returnDate,
        seat: seat,
    };

    var flightQuery
    if(flightclass !== "") {
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
    // Check for roundtrip or oneway by return date
    // console.log(searchData);
    // if (searchData.returnDate == undefined) {
    //     console.log("ReturnDate Undefined!");
    // }


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
                console.log("Flight result");
                console.log(flights);
            }

            res.render("flight/flights-list.ejs", { flights: flights, searchData })
        }
    });
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
                flightclass:flightclass,
                from: from,
                to: to,
                departDate: departDate,
                returnDate: returnDate,
                seat: seat,
            };

            
    var flightQuery
    if(flightclass !== "") {
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

                    res.render("flight/flights-list.ejs", { flights: flights, searchData })
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