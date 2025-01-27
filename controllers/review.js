const Listing = require("../models/listing.js");
const Review = require("../models/review.js")
const ExpressError = require("../utils/ExpressError");

module.exports.createNewReview = async(req,res)=>{
    // console.log(req.user);
    
    let listing =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    //console.log(newReview);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added Successfully");
    //console.log("review saved");
    res.redirect(`/listings/${req.params.id}`);
  }

module.exports.destroyReview = async(req,res)=>{
    let {id,revId} = req.params;
    req.flash("success","Review Deleted Successfully");
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:revId}});
    await Review.findByIdAndDelete(revId);
    res.redirect(`/listings/${id}`);
  }