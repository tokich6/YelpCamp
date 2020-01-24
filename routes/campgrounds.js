var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX ROUTE
router.get("/", function (req, res) {
  //Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

//  NEW ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
  //get data from form and add to capmgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: image, description: desc, price: price, author: author };
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //reirect back to camprounds page
      res.redirect("/campgrounds");
    }
  });
});

//SHOW ROUTE
router.get("/:id", function (req, res) {
  //find the camp with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
    if (err || !foundCamp) {
      req.flash ("error", "Campground not found");
      res.redirect("back");
    } else {
      res.render("campgrounds/show", { campground: foundCamp });
    }
  });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect("/");
    } else {
      //show the updated campground
      req.flash ("success", "The campground has been updated");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      campground.remove();
      req.flash ("success", "The campground has been deleted");
      res.redirect("/campgrounds");
    }
  });
});


module.exports = router;