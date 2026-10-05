const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utills/wrapAsync.js");

const {
    isLoggedIn,
    validateReview
} = require("../middleware.js");

const {
    createReview,
    deleteReview
} = require("../controllers/review.js");


// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(createReview)
);


// DELETE REVIEW
router.delete(
    "/:reviewId",
    isLoggedIn,
    wrapAsync(deleteReview)
);


module.exports = router;