const express = require("express");
const router = express.Router();
const wrapAsync = require("../utills/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utills/ExpressError.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.message);
    }

    next();
};


router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

router.get("/new", (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error" , "you must be logged in to create listing");
        return res.redirect("/login");
    }
    res.render("listings/new");
});


router.get("/:id", wrapAsync(async (req, res) => {


    const { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error" , "Listing you requested for does not exitst ");
        res.redirect("/Listings");
    }

    res.render("listings/show", { listing });

}));

//create Route 

router.post("/", validateListing, wrapAsync(async (req, res) => {


    const newListing = new Listing(req.body.Listings);

    await newListing.save();
    req.flash("success" , "New Listing Created!");

    res.redirect("/Listings");
}));




router.put("/:id", validateListing, wrapAsync(async (req, res) => {

    if (!req.body.Listings) {
        new ExpressError(400, "Invalid listing data");
    }


    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, {
        ...req.body.Listings,

    });

    res.redirect("/Listings");


}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/update", { listing });

}));

router.delete("/:id", wrapAsync(async (req, res) => {

    console.log("PARAMS:", req.params);

    const { id } = req.params;

    console.log("ID:", id);

    const result = await Listing.findByIdAndDelete(id);

    console.log("RESULT:", result);

    res.redirect("/Listings");
}));

module.exports = router;

