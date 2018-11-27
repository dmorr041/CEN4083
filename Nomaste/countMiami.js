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
var businessIDs = [];

function getMiamiRestaurantData() {
    client.search({
        term:'restaurants',
        location: 'miami',
        limit: 50
    }).then(response => {
        for(var j = 0; j < 50; j++){
            var businessID      = response.jsonBody.businesses[j].id;
            businessIDs.push(businessID);
            console.log(businessIDs[j]);
            name                = response.jsonBody.businesses[j].name;
            image               = response.jsonBody.businesses[j].image_url;
            address             = response.jsonBody.businesses[j].location.address1 + ', '                      
                                    + response.jsonBody.businesses[j].location.city + ', ' + response.jsonBody.businesses[j].location.state    
                                    + ' ' + response.jsonBody.businesses[j].location.zip_code
            lat                 = response.jsonBody.businesses[j].coordinates.latitude;
            long                = response.jsonBody.businesses[j].coordinates.longitude;
    
            console.log(j + ':')
            console.log('Name/Title of Post: ' + name);           // Business Name
            console.log('Image URL: ' + image);      // Image URL
            console.log('Address: ' + address);
            console.log('Latitude: ' + lat);               // Lat
            console.log('Longitude: ' + long + '\n');      // Long
        }
        
    }).catch(e => {
        console.log(e);
    });
}

function getReviews(businessID) {
    client.reviews(businessID).then(response => {
        console.log('Comment #1: ' + response.jsonBody.reviews[0].text);
        console.log('Comment #2: ' + response.jsonBody.reviews[1].text);
        console.log('Comment #3: ' + response.jsonBody.reviews[2].text);
    }).catch(e => {
        console.log(e);
    });
}

// console.log('BEFORE REVIEWS')
// for(var n = 0; n < businessIDs.length; n++) {
//     client.reviews(businessIDs[n]).then(response => {
//         console.log('"Caption" Data: ' + response.jsonBody.reviews[0].text);
//         console.log('Comment 1: ' + response.jsonBody.reviews[1].text);
//         console.log('Comment 2: ' + response.jsonBody.reviews[2].text);
//     }).catch(e => {
//         console.log(e);
//     });
// }
// console.log('AFTER REVIEWS')

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



