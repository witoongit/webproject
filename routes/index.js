var express = require('express'),
    router  = express.Router(),
    User    = require('../models/user'),
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
            res.redirect('/manager');
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

router.get('/user', isLoggedIn , function(req,res){
    res.render("userAccount.ejs")
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to sign in frist.')
    res.redirect('/sign-in');
}


module.exports = router;