const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs")
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStartegy = require("passport-local");
let User = require("./models/user.js");


const ExpressError = require("./utills/ExpressError.js");



const listingRouter = require("./router/listing.js");
const reviewsRouter = require("./router/reviews.js");
const userRouter = require("./router/user.js");





const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB ");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const sessionOptions = {
    secret : "mysuperecretcode",
    resave : false ,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge : 1000 * 60 *60 * 24 * 7 ,
        httpOnly : true 
    }
};

app.get("/", (req, res) => {
    console.log("Hello world ");
    res.redirect("/Listings");

});
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStartegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req , res , next ) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})



app.use("/Listings" , listingRouter);
app.use("/Listings/:id/review" , reviewsRouter);
app.use("/" , userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;

    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");


})

