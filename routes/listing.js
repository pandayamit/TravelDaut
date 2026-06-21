const express= require("express");
const router= express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
// const Review = require("./models/reviews.js")



// Middleware for listing add & edit 
const validateListing= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if (error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    next();
}

// ..................................Index Route................................................

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
})
);

//....................................New Route.............................................


router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//...................................Show Route..............................................

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listingView = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listingView })
})
);


//....................................Create Route...........................................

router.post("/",validateListing, wrapAsync(async (req, res) => {
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
    res.redirect("/listings");
})
);


//.......................................Edit Route.........................................

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listings/edit.ejs", { list });
})
);



//......................................Update Route..........................................


router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
     if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)
})
);


//.....................................Delete Route.........................................

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id, {})
    console.log(deletedListing);
    res.redirect(`/listings`);
})
);

module.exports =router;
