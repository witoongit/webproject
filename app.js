var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    Mongoose    = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    User            = require('./models/user')


app.use(express.static('public'));
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
passport.use(new LocalStrategy({
    usernameField: 'email',
},    
    User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


app.get('/', function(req,res){
    res.render("home.ejs")
});

app.get('/flights', function(req,res){
    res.render("flights.ejs")
});

app.get('/flights-list', function(req,res){
    res.render("flights-list.ejs")
});

app.get('/flight-book', function(req,res){
    res.render("flight-book.ejs")
});

app.get('/sign-up', function(req,res){
    res.render("sign-up.ejs")
});

app.post('/sign-up', function(req,res){

    var username    = req.body.email;
    var title       = req.body.title;
    var firstname   = req.body.firstname;
    var lastname    = req.body.lastname;
    var phonenumber = req.body.phonenumber;
    var email       = req.body.email;
    var password          = req.body.password;
    var confirmpassword   = req.body.confirmpassword;

    if(password !== confirmpassword){
        console.log("password not match")
        return res.redirect('/sign-up');
    }

    var newUser = new User({username:username, title:title, firstname:firstname, lastname:lastname, phonenumber:phonenumber, email:email});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.redirect('/sign-up');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/')
        });
    });  
});

app.get('/sign-in', function(req,res){
    res.render("sign-in.ejs")
});

app.post('/sign-in', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/sign-in'
    }), function (req,res) { 
        console.log(req.user.password);   
});

app.get('/sign-out', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/user', function(req,res){
    res.render("userAccount.ejs")
});


app.get('*', function(req,res){
    res.send('Bad request.')
})

app.listen('3000', function(req, res){
    console.log('Server is running');
});
