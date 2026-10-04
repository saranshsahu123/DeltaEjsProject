const express = require("express");
const router = express.Router();

const wrapAsync = require("../utills/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const {
    index,
    renderNewForm,
    showListing,
    createListing,
    renderEditForm,
    updateListing,
    deleteListing
} = require("../controllers/listing.js");


// INDEX
router.get(
    "/",
    wrapAsync(index)
);


// NEW
router.get(
    "/new",
    isLoggedIn,
    renderNewForm
);


// SHOW
router.get(
    "/:id",
    isLoggedIn,
    wrapAsync(showListing)
);


// CREATE
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(createListing)
);


// EDIT
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(renderEditForm)
);


// UPDATE
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(updateListing)
);


// DELETE
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(deleteListing)
);


module.exports = router;