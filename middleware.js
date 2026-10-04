const Listing = require("./models/listing.js");

const isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in to continue");

        return res.redirect("/login");
    }

    next();
};


const saveRedirectUrl = async (req, res, next) => {

    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


const isOwner = async(req , res , next )=> {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/Listings");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/Listings/${id}`);
    }

        next();
}

module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner
};