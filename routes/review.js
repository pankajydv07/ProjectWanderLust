const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/review.js")

let {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js")



//view reviews Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createNewReview));


//Delete revierws route
router.delete("/:revId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
  
  module.exports =router;