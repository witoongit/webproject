var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/uploads/');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    imageFilter = function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return callback(new Error('Only JPG, jpeg, PNGm and GIF image files are allowed!'), false);
        }
        callback(null, true);
    },
    upload = multer({ storage: storage, fileFilter: imageFilter }),

    Flight = require('../models/flight'),
    Airport = require('../models/airport'),
    Airline = require('../models/airline')



router.get('/flight', isLoggedIn, isAdmin, function (req, res) {

    var flightclass = "all"
    
    Flight.find().populate('airlineName from to').exec(function (err, flight) {
        if (err) {
            console.log(err);
        }
        else {
            Airport.find({}, function (err, airport_result) {
                if (err) {
                    console.log(err);
                }
                else {
                    Airline.find({}, function (err, airline_result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('manager/flight.ejs', { flights: flight, airports: airport_result, airlines: airline_result, flightclass})
                        }
                    });

                }
            });

        }
    });
});

router.post('/flight-add',  function (req, res) {

    var flightID = req.body.flightID;
    var airlineName = req.body.airlineName;
    var departTime = req.body.departTime;
    var arriveTime = req.body.arriveTime;
    var totalTime = req.body.totalTime;
    var maxseat = req.body.maxseat;
    var from = req.body.from;
    var to = req.body.to;
    var flightCost = req.body.flightCost;
    var flightclass = req.body.flightclass;
    var baggage = req.body.baggage;
    var wifi = req.body.wifi;
    var entertain = req.body.entertain;
    var meal = req.body.meal;
    var usb = req.body.usb;
    var stop = req.body.stop;



    var newFlight =
    {
        flightID: flightID,
        airlineName: airlineName,
        departTime: departTime,
        arriveTime: arriveTime,
        totalTime: totalTime,
        maxseat: maxseat,
        from: from,
        to: to,
        flightCost: flightCost,
        flightclass: flightclass,
        classdetail: {
            baggage: baggage,
            wifi: wifi,
            entertain: entertain,
            meal: meal,
            usb: usb
        },
        stop: stop
    };

    Flight.create(newFlight, function (err, flight) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/flight')
        }
    });
});


router.get('/:id/flight-edit', isLoggedIn, isAdmin, function (req, res) {

    Flight.findById(req.params.id).populate("airlineName from to").exec(function (err, flight_result) {
        if (err) {
            console.log(err);
        }
        else {
            Airport.find({}, function (err, airport_result) {
                if (err) {
                    console.log(err);
                }
                else {
                    Airline.find({}, function (err, airline_result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('manager/flight-edit', { flight: flight_result, airports: airport_result, airlines: airline_result })
                        }
                    });

                }
            });
        }
    });
});

router.put('/:id/flight-edit', function (req, res) {

    Flight.findByIdAndUpdate(req.params.id, req.body.flight, function (err, flight_updated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/flight')
        }

    });

});

router.delete('/:id', function (req, res) {
    Flight.findByIdAndRemove(req.params.id, function (err, flight_deleted) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/flight')
        }

    });

});

router.post('/search',  function (req, res) {

    var flightclass = req.body.flightclass;
    var result = req.body.result;
    var search_by = req.body.by;

    console.log(result);
    if (result === ""){
        Flight.find({}).populate("airlineName from to").exec(function (err, flight) {
            if (err) {
                console.log(err);
            }
            else {
                Airport.find({}, function (err, airport_result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        Airline.find({}, function (err, airline_result) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.render('manager/flight.ejs', { flights: flight, airports: airport_result, airlines: airline_result, flightclass  })
                            }
                        });

                    }
                });
            }
        });

    }

    if (search_by === "by_airline") {

        Airline.find({ name: { "$regex": result, $options: 'i' } }, function (err, airlines) {
            if (err) {
                console.log(err);
            }
            else {
                var id_array = [];
                airlines.forEach(airline => {
                   id_array.push(airline._id) 
                });
                Flight.find({ airlineName: {$in : id_array} } ).populate("airlineName from to").exec(function (err, flight) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        Airport.find({}, function (err, airport_result) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                Airline.find({}, function (err, airline_result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        res.render('manager/flight.ejs', { flights: flight, airports: airport_result, airlines: airline_result, flightclass })
                                    }
                                });

                            }
                        });
                    }
                });
            }
        });

    }
    else if (search_by === "by_city") {

        Airport.find({ city: { "$regex": result, $options: 'i' } }, function (err, airports) {
            if (err) {
                console.log(err);
            }
            else {
                var id_array = [];
                airports.forEach(airport => {
                   id_array.push(airport._id) 
                });
                Flight.find({ from: id_array }).populate("airlineName from to").exec(function (err, flight) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        Airport.find({}, function (err, airport_result) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                Airline.find({}, function (err, airline_result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        res.render('manager/flight.ejs', { flights: flight, airports: airport_result, airlines: airline_result })
                                    }
                                });

                            }
                        });
                    }
                });
            }
        });

    }

});

router.post('/sort', function (req, res) {
    
    var flightclass = req.body.flightclass;
    var sort_type = req.body.sort_type;
    var sortquery;

    if (sort_type === "cost_low") {
        sortquery = { flightCost: 1 }
    }
    else if (sort_type === "cost_high") {
        sortquery = { flightCost: -1 }
    }
    else if (sort_type === "flight_low") {
        sortquery = { totalTime: 1 }
    }
    else if (sort_type === "flight_high") {
        sortquery = { totalTime: -1 }
    }
    
    var flightQuery
    if(flightclass !== "all" && flightclass !== undefined) {
        flightQuery = {
            flightclass: flightclass, 
        } 
    } else {
       flightQuery = {}
    }

    Flight.find(flightQuery).populate("airlineName from to").sort(sortquery).exec(function (err, flight) {
        if (err) {
            console.log(err);
        }
        else {
            Airport.find({}, function (err, airport_result) {
                if (err) {
                    console.log(err);
                }
                else {
                    Airline.find({}, function (err, airline_result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('manager/flight.ejs', { flights: flight, airports: airport_result, airlines: airline_result, flightclass })
                        }
                    });

                }
            });
        }
    });

});

router.get('/airport', isLoggedIn,  isAdmin, function (req, res) {
    Airport.find({}, function (err, airport_result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('manager/airport.ejs', { airports: airport_result })
        }
    });
});

router.post('/airport-add', function (req, res) {

    var name = req.body.name;
    var country = req.body.country;
    var city = req.body.city;
    var airport_info =
    {
        name: name,
        country: country,
        city: city,
    };

    Airport.create(airport_info,  function (err, newAirport) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/airport')
        }
    });
});


router.get('/:id/airport-edit', isLoggedIn,  isAdmin, function (req, res) {

    Airport.findById(req.params.id, function (err, airport_result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('manager/airport-edit', { airport: airport_result })
        }
    });
});

router.put('/:id/airport-edit', function (req, res) {
    Airport.findByIdAndUpdate(req.params.id, req.body.airport, function (err, flight_updated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/airport')
        }

    });

});

router.delete('/:id/airport-del', function (req, res) {
    Airport.findByIdAndRemove(req.params.id, function (err, flight_deleted) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/airport')
        }

    });

});


router.get('/airline', isLoggedIn,  isAdmin, function (req, res) {
    Airline.find({}, function (err, airline_result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('manager/airline.ejs', { airlines: airline_result })
        }
    });
});

router.post('/airline-add',  upload.single('image'), function (req, res) {

    req.body.airline.icon = '/uploads/' + req.file.filename;
    Airline.create(req.body.airline, function (err, newAirline) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/airline')
        }
    });
});


router.get('/:id/airline-edit', isLoggedIn,  isAdmin, function (req, res) {

    Airline.findById(req.params.id, function (err, airline_result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('manager/airline-edit', { airline: airline_result })
        }
    });
});

router.put('/:id/airline-edit', upload.single('image'), function (req, res) {
    if (req.file) {
        req.body.airline.icon = '/uploads/' + req.file.filename;
    }
    Airline.findByIdAndUpdate(req.params.id, req.body.airline, function (err, airline_updated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/airline')
        }

    });

});

router.delete('/:id/airline-del',  function (req, res) {
    Airline.findByIdAndRemove(req.params.id, function (err, flight_deleted) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/manager/airline')
        }

    });

});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to sign in frist.')
    res.redirect('/sign-in');
}

function isAdmin(req, res, next){
    if(req.user.tier == 'Admin'){
        return next();
    }
    req.flash('error', "You are not admin. Don't do that ")
    res.redirect('/');
}



module.exports = router;