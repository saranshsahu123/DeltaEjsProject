const express = require("express");

const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utills/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup" , wrapAsync(async (req , res ) => {

    try{

        let {username , email , password } = req.body;
        const  newUser = new User({email , username});
      const registerdUser = await User.register(newUser , password);
     
      req.flash("success" , "welcome to wonderlusts");
      res.redirect("/Listings");
    }
catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

}))

router.get("/login" , (req , res) => {
    res.render("users/login.ejs");
})

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        res.redirect("/listings");
    }
);

module.exports = router;