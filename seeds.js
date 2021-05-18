var mongoose = require('mongoose');
    User     = require('./models/user');
    Flight   = require('./models/flight');

var userData = [
    {
    username: "witoonaoo@gmail.com",
    title:"Chad.",
    firstname: "witoon",
    lastname: "theadmin",
    phonenumber: "",
    email: "witoonaoo@gmail.com",
    password: "123",
    tier: "Admin"
    },

    {
        username: "test@test.test",
        title:"Chad.",
        firstname: "test",
        lastname: "test",
        phonenumber: "",
        email: "test@test.test",
        password: "123",
        tier: "Admin"
    }
]

var flightData = [

]

function seedDB() {
    User.remove({tier:"Admin"}, function(err, removed) {
        if(err){
            console.log(err)
        }
        console.log("have been remove")
        console.log(removed)
        console.log("have been remove")
        
        userData.forEach(function(seed) {
            User.create(seed, function(err, user){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("New data added")
                }
            })       
     
        });
    })
}

module.exports = seedDB;