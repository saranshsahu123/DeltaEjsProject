const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utills/wrapAsync.js");
const ExpressError = require("../utills/ExpressError.js");
const {  reviewSchema} = require("../schema.js");
// reviews 
// post Route 

const validateReview  = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.message);
    }

    next();
};

router.post("/" , validateReview , wrapAsync(async(req , res )=> {

    console.log("POST REVIEW ROUTE CALLED");
    console.log("Listing ID:", req.params.id);
    console.log("Review Data:", req.body.review);
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("new Review Saved ");
    res.redirect(`/Listings/${listing._id}`)
}));


//reviews 
// Delete Route

router.delete("/:reviewId", wrapAsync(async (req, res) => {

    const { id, reviewId } = req.params;
    console.log(req.params);

    await Listing.findByIdAndUpdate(
        id,
        { $pull: { reviews: reviewId } }
    );

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/Listings/${id}`);
}));

module.exports = router;
