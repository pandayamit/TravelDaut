const Listing = require("./models/listing");
const Review = require("./models/reviews");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl= req.originalUrl;
        req.flash("error","You must me logged in to create listing!");
      return  res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner= async(req,res,next)=>{
  let {id}= req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","Oops!,Property deatils can only modified by authorized User")
    return res.redirect(`/listings/${id}`);
  }
  next();
} 


// Middleware for listing add & edit 
module.exports.validateListing= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if (error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    next();
}

// Validate for Reviews

module.exports.validateReview =(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
}



module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id,reviewId}= req.params;
  let listing= await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","Oops!,Reviews can only modified by authorized User")
    return res.redirect(`/listings/${id}`);
  }
  next();
} 