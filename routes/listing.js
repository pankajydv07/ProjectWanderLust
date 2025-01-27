const express = require("express");


const Listing = require("../models/listing.js");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync");
const {validateObjectId,validateListing, isLoggedIn, isOwner } = require("../middleware.js");

const listingController= require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({storage })


router
  .route("/")
  .get(
    wrapAsync(listingController.index)
  )
  .post(
     isLoggedIn,upload.single("listing[image]"),
    wrapAsync(listingController.createNewListing),validateListing
  );




// New Route
router.get("/new", isLoggedIn,(listingController.renderNewListingForm ));


router
  .route("/:id")
  .get(
    validateObjectId,
    wrapAsync(listingController.showListing)
  )
  .put(
    validateObjectId, isLoggedIn,isOwner,upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  .delete( 
    validateObjectId,isLoggedIn,isOwner,
    wrapAsync(listingController.deleteListing)
  );
  

// Edit Route
router.get(
  "/:id/edit",
  validateObjectId,isLoggedIn,isOwner,
  wrapAsync(listingController.renderEditForm)
);




module.exports = router;