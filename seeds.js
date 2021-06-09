var mongoose = require('mongoose');
    // User     = require('./models/user');
    // Flight   = require('./models/flight');
    Country  = require('./models/flight');

var countryData = [
    {
        country: "Thailand",
        town: "Bangkok"
    },

    {
        country: "Japan",
        town: "Tokyo"
    }
]

function seedDB() {
    Country.deleteMany({}, function(err, removed) {
        if(err){
            console.log(err)
        }
        console.log("have been remove")
        console.log(removed)
        console.log("have been remove")
        
        countryData.forEach(function(seed) {
            Country.create(seed, function(err, user){
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