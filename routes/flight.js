const { search } = require('./manager');

var express = require('express'),
    router = express.Router(),
    Flight = require('../models/flight'),
    Airport = require('../models/airport')

    
router.get('/', function (req, res) {
    Airport.find( {}, function (err, airport_result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("flight/flight.ejs", {airports: airport_result})
        }
    });
});

router.post('/search', function (req, res) {

    var from = req.body.from;
    var to = req.body.to;
    var departDate = req.body.departDate;
    var returnDate = req.body.returnDate;
    var seat = req.body.seat


    var searchData =
    {
        to: to,
        departDate: departDate,
        returnDate: returnDate,
        seat: seat,
    };
    // Check for roundtrip or oneway by return date
    console.log(searchData);
    if(searchData.returnDate == undefined){
        console.log("ReturnDate Undefined!");
    }

    Flight.find({from: from, to: to}).populate("airlineName from to").exec(function (err, flights) {
        if (err) {
            console.log(err);
        }
        else {
            flights.forEach(flight => {
                searchData.to = flight.to.city;
            });

            // Check if there's no result found
            if(flights.length == 0){
                console.log("Flight result");
                console.log(flights);
            }
       
            res.render("flight/flights-list.ejs", { flights: flights, searchData })
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