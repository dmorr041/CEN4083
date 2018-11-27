'use strict';
// var mongoose                = require("mongoose");
// var Post                    = require("./models/post");
const yelp = require('yelp-fusion');
const client = yelp.client('s50Uld4c1jKVF98wk_0LUJSipvCgdhX_33gRT5FMid4f1QOeY5ZWz50eLtkLr0FOPXyXBpnx8xzNVRCcNZg2HXBWqzdyKrHol2EpJaPjWvVMqHc9uZAahkGHEBsoW3Yx');

var currentOffset = 51;

var name;
var image;
var address;
var lat;
var long;
var username = 'dmorr041';
var comments;

client.search({
    term:'restaurants',
    location: 'miami',
    limit: 50
}).then(response => {
    for(var j = 0; j < 50; j++){
        var businessID      = response.jsonBody.businesses[j].id;
        name            = response.jsonBody.businesses[j].name;
        image           = response.jsonBody.businesses[j].image_url;
        address         = response.jsonBody.businesses[j].location.address1 + ', '                      
                                + response.jsonBody.businesses[j].location.city + ', ' + response.jsonBody.businesses[j].location.state    
                                + ' ' + response.jsonBody.businesses[j].location.zip_code
        lat             = response.jsonBody.businesses[j].coordinates.latitude;
        long            = response.jsonBody.businesses[j].coordinates.longitude;

        console.log(j + ':')
        console.log('Name/Title of Post: ' + name);           // Business Name
        console.log('Image URL: ' + image);      // Image URL
        console.log('Address: ' + address);
        console.log('Latitude: ' + lat);               // Lat
        console.log('Longitude: ' + long);      // Long
    }
}).catch(e => {
    console.log(e);
});

// for(var i = 50; i < 1000; i++){
//     client.search({
//         term:'restaurants',
//         location: 'miami',
//         limit: 50,
//         offset: currentOffset
//     }).then(response => {
//         for(var k = 0; k < 50; k++){
//             console.log(i + ":" + response.jsonBody.businesses[i].name);
//         }
//     }).catch(e => {
//         console.log(e);
//     });
// }



