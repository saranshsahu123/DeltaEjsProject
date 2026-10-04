const Listing = require("../models/listing.js");
const ExpressError = require("../utills/ExpressError.js");


// INDEX
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index", { allListings });
};


// NEW
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};


// SHOW
module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist"
        );

        return res.redirect("/Listings");
    }

    res.render("listings/show", { listing });
};


// CREATE
module.exports.createListing = async (req, res) => {

    if (!req.body.Listings) {
        throw new ExpressError(400, "Invalid listing data");
    }

    const newListing = new Listing(req.body.Listings);

    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New Listing Created!");

    res.redirect("/Listings");
};


// EDIT FORM
module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/Listings");
    }

    res.render("listings/update", { listing });
};


// UPDATE
module.exports.updateListing = async (req, res) => {

    if (!req.body.Listings) {
        throw new ExpressError(400, "Invalid listing data");
    }

    const { id } = req.params;

    await Listing.findByIdAndUpdate(
        id,
        { ...req.body.Listings },
        {
            runValidators: true
        }
    );

    req.flash("success", "Listing updated successfully");

    res.redirect(`/Listings/${id}`);
};


// DELETE
module.exports.deleteListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/Listings");
    }

    req.flash("success", "Listing deleted successfully");

    res.redirect("/Listings");
};