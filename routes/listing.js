const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("../schema.js");
// const Review = require("./models/reviews.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


// ..................................Index Route................................................

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
})
);

//....................................New Route.............................................


router.get("/new", isLoggedIn, (req, res) => {
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
});

//...................................Show Route..............................................

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listingView = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    if (!listingView) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listingView })
})
);


//....................................Create Route...........................................

router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    // let {title,description,image,price,location,country} = req.body;
    // console.log("Working");
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }


    // Validation with joi 
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(404, result.error);
    // }


    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;


    //Validation of schema without using joi
    // if(!newListing.title){
    //     throw new ExpressError(400,"title is missing");
    // }
    //  if(!newListing.description){
    //     throw new ExpressError(400,"description is missing");
    // }
    //  if(!newListing.image){
    //     throw new ExpressError(400,"image is missing");
    // }
    //  if(!newListing.price){
    //     throw new ExpressError(400,"price is missing");
    // }
    //  if(!newListing.location){
    //     throw new ExpressError(400,"location is missing");
    // }
    //  if(!newListing.country){
    //     throw new ExpressError(400,"country is missing");
    // }
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
})
);


//.......................................Edit Route.........................................

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });
})
);



//......................................Update Route..........................................


router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`)
})
);


//.....................................Delete Route.........................................

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id, {})
    console.log(deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect(`/listings`);
})
);

module.exports = router;
