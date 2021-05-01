var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
    // mongoose = require('mongoose');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// mongoose.connect('mongodb://localhost/DogeAir');
// var dogeairSchrma = new mongoose.Schema({
//     name: String,
//     image: String,
//     desc: String
// });

// var Dogeair = mongoose.model('Dogeair', dogeairSchrma);

// Dogeair.create(
//     {
//         name: "Doge1",
//         image: "http://i.imgur.com/1pLHYey.jpg",
//         desc: 'Such plane'
//     },
//     function(err, dogeair) {
//         if(err){
//             console.log(err);
//         } else {
//             console.log('New data added');
//             console.log(dogeair);
//         }
        
//     }
// );

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


app.get('/sign-in', function(req,res){
    res.render("sign-in.ejs")
});
app.get('/sign-up', function(req,res){
    res.render("sign-up.ejs")
});

app.get('*', function(req,res){
    res.send('Bad request.')
})

app.listen('3000', function(req, res){
    console.log('Server is running');
});
