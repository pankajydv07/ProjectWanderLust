const Listing= require("../models/listing.js");


module.exports.index= async (req, res) => {
    const lists = await Listing.find();
    res.render("listings/index.ejs", { lists });
  }

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist.");
      res.redirect("/listings");
    } else {
      res.render("listings/edit.ejs", { listing });
    }
  }

module.exports.updateListing =async (req, res) => {
      const { id } = req.params;
      const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
      if (typeof req.file !== "undefined") {
        let filename = req.file.filename;
        let url = req.file.path;
        updatedListing.image = { url, filename };
        await updatedListing.save();
      }
      req.flash("success", "Listing Updated Successfully");
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    req.flash("success", "Listing Deleted Successfully");

    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    res.redirect("/listings");

  }

  module.exports.createNewListing = async (req, res, next) => {
      let filename = req.file.filename;
      let url = req.file.path;
      const newListing = new Listing(req.body.listing);
      newListing.owner=req.user._id;
      newListing.image={url,filename}
      await newListing.save();
      req.flash("success", "New Listing Added Successfully");
      res.redirect("/listings");
    }

module.exports.renderNewListingForm = (req, res) => {

    res.render("listings/new.ejs");
  }

  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id)
    .populate({path:"reviews",
      populate:{
        path:"author",
      },
    })
    .populate("owner");
    // console.log(list);
    // console.log(req.user);
    if (!list) {
      req.flash("error", "Listing you requested for does not exist.");
      res.redirect("/listings");
    } else {
      res.render("listings/show.ejs", { list });
    }

  }