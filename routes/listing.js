const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("../schema.js");
// const Review = require("./models/reviews.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingController = require("../controllers/listing.js");


// ..................................Index Route................................................

router.get("/", wrapAsync(listingController.index));

//....................................New Route.............................................


router.get("/new", isLoggedIn,listingController.renderForm);

//...................................Show Route..............................................

router.get("/:id", wrapAsync(listingController.showListings));


//....................................Create Route...........................................

router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));


//.......................................Edit Route.........................................

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



//......................................Update Route..........................................


router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


//.....................................Delete Route.........................................

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroy));

module.exports = router;
