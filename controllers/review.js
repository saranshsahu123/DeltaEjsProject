const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utills/ExpressError.js");


// CREATE REVIEW
module.exports.createReview = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/Listings");
    }

    const newReview = new Review(req.body.review);

    // Set review author
    newReview.author = req.user._id;

    // Add review to listing
    listing.reviews.push(newReview);

    // Save review
    await newReview.save();

    // Save listing
    await listing.save();

    req.flash("success", "Review added successfully!");

    res.redirect(`/Listings/${listing._id}`);
};


// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {

    const { id, reviewId } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/Listings");
    }

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(
        id,
        {
            $pull: {
                reviews: reviewId
            }
        }
    );

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");

    res.redirect(`/Listings/${id}`);
};