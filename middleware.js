const Listing = require("./models/listing.js");
const ExpressError = require("./utills/ExpressError.js");
const { listingSchema } = require("./schema.js");


const isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in to continue"
        );

        return res.redirect("/login");
    }

    next();
};


const saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


const isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/Listings");
    }

    if (!listing.owner) {
        req.flash("error", "This listing does not have an owner");
        return res.redirect(`/Listings/${id}`);
    }

    if (!req.user) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/Listings/${id}`);
    }

    next();
};


const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.message);
    }

    next();
};



module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    validateListing
};