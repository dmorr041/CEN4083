// ============================= SETUP ====================================== //
require("dotenv").config();

var express                 = require("express"),                   // Import Express package
    app                     = express(),                            // Running instance of Express App
    mongoose                = require("mongoose"),                  // Import Mongoose package
    methodOverride          = require("method-override"),           // Import method-override
    flash                   = require("connect-flash"),             // Import connect-flash
    bodyParser              = require("body-parser"),               // Import body-parser to handle JSON parsing
    passport                = require("passport"),                  // Import passport for user auth
    localStrategy           = require("passport-local"),            // Import passport-local
    User                    = require("./models/user"),             // Import User model
    Post                    = require("./models/post"),             // Import Post model
    Comment                 = require("./models/comment");          // Import Comment model
    fs                      = require("fs");

const PORT = 3000;
    
// Import Routes
var postRoutes              = require("./routes/posts.js"),
    commentRoutes           = require("./routes/comments.js"),
    indexRoutes             = require("./routes/index.js");

// MongoDB Atlas connection 
var uri = 'mongodb+srv://dmorr041:Sageof6paths@nomaste-ctilj.mongodb.net/Nomaste';  // URI connection string provided by MongoDB Atlas cluster
mongoose.connect(uri, function(error) {
    if(error) console.log(error);
    else console.log('working');
});      // Connect mongoose to a database named all_posts
var db = mongoose.connection;


app.use(bodyParser.urlencoded({extended:true}));        // Tell app to use bodyParser package
app.use(methodOverride("_method"));                     // Tell app to use methodOverride package for PUT requests, etc.
app.use(express.static(__dirname + "/public"));         // Tell app to use main.css
app.set("view engine", "ejs");                          // Set view engine so all files in views render as ejs by default
app.use(flash());


// PASSPORT CONFIG
// 1)
app.use(require("express-session")({
    secret: "Sasuke is the supreme ninja",
    resave: false,
    saveUninitialized: false
}));

// 2)
app.use(passport.initialize());
app.use(passport.session());

// 3)
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware that passes currentUser to every route without manual retype
app.use(function(req, res, next){
    res.locals.currentUser = req.user;          // This sets currentUser in any template to req.user
    res.locals.success = req.flash("success");  // Success flash messages
    res.locals.error = req.flash("error");      // Error flash messages
    next();                                     // This runs the callback function of any given route (continues the route)
});

app.use("/", indexRoutes);
app.use("/allPosts", postRoutes);
app.use("/allPosts/:id/comments", commentRoutes);
// ============================= SETUP ====================================== //


// Read the entire file into a string
var str = fs.readFileSync('../../yelp_academic_dataset_business.json', 'utf8');         

// Make an array of strings for each line (each json object)
var strLines = str.split("\n");    

var string = fs.readFileSync('../../yelp_academic_dataset_review2.json', 'utf8');
var stringLines = string.split("\n");

function scrapeReviews() {
    var reviews = [];

    stringLines.forEach((element) => {
        var reviewObj = JSON.parse(element);
        var review = reviewObj.text;
        reviews.push(review);
    });

    return reviews;
}

var reviews = scrapeReviews();
// for(var i = 0; i < reviews.length; i++){
//     console.log(reviews[i]);
// }

function scrapeRestaurantsFrom(city) {
    var restaurants = [];

    // For each element in the array of strings (array of json objects that are currently strings)
    strLines.forEach((element) => {
        var business = JSON.parse(element);   // Turn each element into a real json object - a 'business'

        // If the business is in the given city
        if(business.city == city) {

            // Get the businesses categories as a string
            var categoriesString = JSON.stringify(business.categories);

            // If the business is a Restaurant
            if(categoriesString.includes('Restaurants')){
                restaurants.push(business);
            }
        }
    });

    return restaurants;
}

// List of Phoenix restaurants as JSON objects
var PhoenixRestaurants = scrapeRestaurantsFrom('Phoenix');


function seedDB() {
    
    User.findOne({ username: 'Darien' }, (err, user) => {
        if(!user) console.log('no user');
        else {
            PhoenixRestaurants.forEach((JSONobject) => {
                var newPost = {
                    title: JSONobject.name,
                    caption: '',
                    image: 'https://images.pexels.com/photos/359993/pexels-photo-359993.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    address: JSONobject.address + ', ' + JSONobject.city + ', ' + JSONobject.state,
                    name: JSONobject.name,
                    author: user,
                    lat: JSONobject.latitude,
                    lng: JSONobject.longitude
                };
        
                // Create a new Post using the object from above and save to DB
                Post.create(newPost, function(err, post){
                    if(err){
                        // req.flash("error", "Unable to create post.");
                        console.log('Error creating post');
                    } 
                    else{
                        var j = 0;
                        for(var i = 0; i < 10; i++){
                            Comment.create({author: user, text: reviews[j]}, function(err, comment) {
                                if(err){
                                    console.log('Error creating comment');
                                } 
                                else{
                                    // Grab the id and username from the post request and store it (associate it) in the comment that is created
                                    // comment.author.id = user.id;
                                    // comment.author.username = user.username;
                                    console.log(comment);
                                    
                                    // Save the comment
                                    comment.save();
                                    
                                    post.comments.push(comment);
                                    
                                    // req.flash("success", "Comment successfully added.");
                                    // res.redirect("/allPosts/" + post._id);
                                    console.log('success adding comment to post with user Darien');
                                }
                            });
                            if(j < reviews.length){
                                j++;
                            }
                            post.save();
                        }

                        
                    }
                });
            });
        }
    });
}

// ================================= SERVER ================================= //
app.listen(PORT, process.env.IP, function(){
    console.log("Server started on port " + PORT + "..."); 
});
// ================================= SERVER ================================= //

seedDB();