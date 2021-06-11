const booking = require('../models/booking');

var express = require('express'),
    router  = express.Router(),
    User    = require('../models/user'),
    Booking = require('../models/booking'),
    passport= require('passport')

router.get('/', function(req,res){
    res.render("home.ejs")
});

router.get('/sign-up', function(req,res){
    res.render("sign-up.ejs")
});

router.post('/sign-up', function(req,res){

    var username    = req.body.email;
    var title       = req.body.title;
    var firstname   = req.body.firstname;
    var lastname    = req.body.lastname;
    var phonenumber = req.body.phonenumber;
    var email       = req.body.email;
    var password          = req.body.password;
    var confirmpassword   = req.body.confirmpassword;

    // Check if password match or not if not sent back to register page
    if(password !== confirmpassword){
        console.log("password not match")
        req.flash('error', 'password not match with confirm password.')
        return res.redirect('/sign-up');
    }

    var newUser = new User({username:username, title:title, firstname:firstname, lastname:lastname, phonenumber:phonenumber, email:email});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            req.flash('error', 'This email has already been registed')
            return res.redirect('/sign-up');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to DogeAir!' + user.firstname)
            res.redirect('/')
        });
    });  
});

router.get('/sign-in', function(req,res){
    res.render('sign-in.ejs')
});

router.post('/sign-in',

passport.authenticate('local',
    {
        successFlash: true,
        failureFlash: true,
        // successFlash: 'Successfully log in',
        failureFlash: 'Invalid username or password',
        failureRedirect: '/sign-in'
    }),function(req,res){
        if(req.user.tier === "Admin"){
            // req.flash('success', 'Welcome Admin ' + req.user.firstname)
            res.redirect('/manager/flight');
        }
        else {
            // req.flash('success', 'Welcome to DogeAir! ' + req.user.firstname)
            res.redirect('/');
        }
    }
);

router.get('/sign-out', function(req, res){
    req.logout();
    // req.flash('success', 'You have successfully log out')
    res.redirect('/');
});

router.get('/user/account', isLoggedIn , function(req,res){
    res.render("userAccount.ejs")
});

router.get('/user/booking', isLoggedIn , function(req,res){

    var id = req.user._id;
    var username = req.user.firstname;
    var booking_query = {
        booker: {
            id: id,
            username: username
        }
    }
    console.log(booking_query)
    
    Booking.find(booking_query).populate("contact").populate({ path: 'travelers' }).populate({ path: 'flight', populate: [{ path: 'airlineName' }, { path: 'from', select: 'city' }, { path: 'to', select: 'city' }] }).exec(function(err, booking_result){
        if(err){
           console.log(err);
        } else {
            console.log(booking_result)
            // if (booking_result == null) {
            //     req.flash('error', 'Booking not found please try.')
            //     res.redirect('/current-booking');
            // }
            res.render("userBooking.ejs", {bookings: booking_result})
        }
    });
    
});

router.get('/current-booking', function(req,res){

    if(req.isAuthenticated()){
        res.redirect('/user/booking')
    } else {
        res.render("current-booking.ejs")
    }
    
});

router.post('/current-booking/search', function(req,res){

    var bookingID = req.body.bookingID;

    Booking.findOne( {bookingID:bookingID} ).populate("contact").populate({ path: 'travelers' }).populate({ path: 'flight', populate: [{ path: 'airlineName' }, { path: 'from', select: 'city' }, { path: 'to', select: 'city' }] }).exec(function(err, booking_result){
        if(err){
           console.log(err);
        } else {
            console.log(booking_result)
            if (booking_result == null) {
                req.flash('error', 'Booking not found please try.')
                res.redirect('/current-booking');
            }
            res.render("current-booking-result.ejs", {booking: booking_result})
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


module.exports = router;