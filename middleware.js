
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const mongoose = require("mongoose");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
module.exports.isLoggedIn=(req,res,next)=>{
    //console.log(req.path,"..");
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be signed in to add a new listing");
        return res.redirect("/login");
      }
      next();
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
        //console.log(res.locals.redirectUrl);
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner._id)){
      req.flash("error","You do not have permission");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

// Error Handling Middleware
module.exports.validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      next(new ExpressError(400, "Invalid ID format"));
    }
    next();
  };
  
  //validateListing Middleware
  module.exports.validateListing = (req, res, next) => {
    // Only validate the image if it exists in req.body.listing
    if (req.body.listing && req.body.listing.image && req.body.listing.image.url === "") {
      delete req.body.listing.image.url;
    }
  
    const { error } = listingSchema.validate(req.body);
  
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  
//validateReviews Middleware
  module.exports.validateReview=(req,res,next)=>{
      let {error} = reviewSchema.validate(req.body);
      
      if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
    }

    module.exports.isReviewAuthor = async(req,res,next)=>{
        let {id,revId}=req.params;
        let review=await Review.findById(revId);
        if(!res.locals.currUser._id.equals(review.author)){
          req.flash("error","You do not have permission");
          return res.redirect(`/listings/${id}`);
        }
        next();
    }