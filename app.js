var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    Mongoose    = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    User            = require('./models/user'),
    Flight          = require('./models/flight'),
    Country         = require('./models/country'),
    Booking         = require('./models/booking'),
    indexRoutes     = require('./routes/index'),
    seedDB          = require('./seeds');

// seedDB();

app.use(express.static('public'));
app.use(express.static('javascript'));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

Mongoose.connect('mongodb://localhost/DogeAir');


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

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use('/', indexRoutes);


app.get('/flights', function(req,res){
    res.render("flights.ejs")
});

app.post('/flight/search', function(req,res){

    var from = req.body.from;
    var to = req.body.to;
    var departDate = req.body.departDate;
    var seat = req.body.seat
    var searchData = 
    {
        to:to, 
        departDate:departDate, 
        seat:seat,
    };

        var query  = {from: { "$regex": from}, to: { "$regex": to} };
        console.log(query)
        
        
        Flight.find(query, function(err, flight) {
            if(err){
                console.log(err);
            }
            else{
               
                console.log("Flight result");
                res.render("flights-list.ejs", {flights:flight, searchData} )
            }
        });

     

    });


app.post('/flight/:id/confirm', function(req,res){
    var flightid = req.body.flightid;
    var departDate = req.body.departDate;
    var seat = req.body.seat
    var  bookinfo = 
    {
        departDate:departDate, 
        seat:seat,
    };

    console.log("Booking info")
    console.log(bookinfo)

    Flight.findOne({_id:flightid}, function(err, flight) {
        if(err){
            console.log(err);
        }
        else{
           
            console.log("Flight result");
            console.log(flight)
            res.render("flight-confirm.ejs", {flights:flight, bookinfo} )
        }
    });

    



});

app.post('/flight/:id/booking', function(req,res){
    // var flightid = req.body.flightid;
    // var departDate = req.body.departDate;
    // var seat = req.body.seat
    // var  bookinfo = 
    // {
    //     departDate:departDate, 
    //     seat:seat,
    // };

    // Flight.find({_id:flightid}, function(err, flightbooked) {
    //     if(err){
    //         console.log(err)
    //     } else {
    //         console.log("flight booked")
    //         console.log(flightbooked)
    //         Booking.create(bookinfo, function (err, newbooking) {
    //             if(err){
    //                 console.log(err)
    //             } else {
    //                 console.log("after create booking")
    //                 console.log(newbooking)
    //                 console.log("flight booked2")
    //                 console.log(flightbooked)
    //                 flightbooked.bookings.push(newbooking);
    //                 flightbooked.save()
    //                 res.render('booking.ejs', {flight:flightbooked} )
    //             }

    //         });
    //     }
    // });
    res.render('booking.ejs')
});

app.post('/flight/payment', function(req,res){
    res.render("payment.ejs")
});


app.get('/flight/payment/confirm', function(req,res){
    res.render("payment-confirm.ejs")
});


app.get('/flight/payment/done', function(req,res){
    res.render("payment-done.ejs")
});



app.get('/manager', function(req,res){
    Flight.find({}, function(err, flight) {
        if(err){
            console.log(err);
        }
        else{
            res.render('manager.ejs', {flights:flight})
        }
    });
});

app.post('/manager', function(req,res){

    var flightID        = req.body.flightID;  
    var airlineName     = req.body.airlineName;
    var departTime      = req.body.departTime;
    var arriveTime      = req.body.arriveTime;
    var from            = req.body.from;
    var to              = req.body.to;    
    var flightCost      = req.body.flightCost; 
    var newFlight = 
    {
        flightID:flightID, 
        airlineName:airlineName,
        departTime:departTime,
        arriveTime:arriveTime, 
        from:from,
        to:to,  
        flightCost:flightCost
    };
   
    Flight.create(newFlight, function(err, flight) {
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/manager')
        }
    });
});

app.post('/manager/search', function(req,res){

    var result = req.body.result;
    var query  = {airlineName: { "$regex": result} };
    console.log(query)
    console.log(result);

    Flight.find(query, function(err, flight) {
        if(err){
            console.log(err);
        }
        else{
            res.render('manager.ejs', {flights:flight})
        }
    });


});

app.post('/manager/sort', function(req,res){

    var query  = Flight.find().sort({flightCost: -1})
    console.log(query)

    Flight.find(query, function(err, flight) {
        if(err){
            console.log(err);
        }
        else{
            res.render('manager.ejs', {flights:flight})
        }
    });

});



app.get('*', function(req,res){
    res.send('Bad request.')
})

app.listen('3000', function(req, res){
    console.log('Server is running');
});
