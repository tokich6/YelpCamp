var express    = require ("express"),
    app        = express(),
    bodyParser = require ("body-parser"),
    mongoose   = require ("mongoose"),
    flash      = require ("connect-flash"),
    passport   = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user")
    seedDB     = require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require ("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v10";

mongoose.connect(url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useUnifiedTopology: true, 
  useFindAndModify:false,
  useCreateIndex:true  
}).then(()=> {
 console.log("Connected to Database");
}). catch(err => {
  console.log("ERROR", err.message);
});

app.use (bodyParser.urlencoded({extended: true}));
app.set ("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the database
// seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Bulgaria",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
 res.locals.currentUser = req.user;
 res.locals.error       = req.flash("error");
 res.locals.success     = req.flash("success");
 next();
});

//USING ROUTES
app.use ("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use ("/", indexRoutes);

//PORT CONFIG
app.listen (process.env.PORT || 3000, function(){
 console.log ("The YelpCamp server has started");
});