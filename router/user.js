const express = require("express");
const router = express.Router();

const passport = require("passport");

const {
    saveRedirectUrl
} = require("../middleware.js");

const {
    renderSignupForm,
    signup,
    renderLoginForm,
    login,
    logout
} = require("../controllers/user.js");

const wrapAsync = require("../utills/wrapAsync.js");


// SIGNUP FORM
router.get(
    "/signup",
    renderSignupForm
);


// SIGNUP
router.post(
    "/signup",
    wrapAsync(signup)
);


// LOGIN FORM
router.get(
    "/login",
    renderLoginForm
);


// LOGIN
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    login
);


// LOGOUT
router.get(
    "/logout",
    logout
);


module.exports = router;