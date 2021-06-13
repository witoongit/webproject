var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    Mongoose = require('mongoose'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),

    User = require('./models/user'),

    indexRoutes = require('./routes/index'),
    flightsRoutes = require('./routes/flight'),
    paymentRoutes = require('./routes/payment'),
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

app.use('/flight/payment', paymentRoutes);

app.use('/manager', managerRoutes);


app.get('*', function (req, res) {
    res.send('Bad request.')
})

app.listen('3000', function (req, res) {
    console.log('Server is running');
});
