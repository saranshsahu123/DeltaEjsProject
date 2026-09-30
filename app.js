const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs")
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utills/wrapAsync.js");
const ExpressError = require("./utills/ExpressError.js");
const { listingSchema } = require("./schema.js");


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



app.get("/", (req, res) => {
    console.log("Hello world ");
    res.send("hello world");

});

const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.message);
    }

    next();
};

app.get("/Listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

app.get("/Listings/new", (req, res) => {
    res.render("listings/new");
});


app.get("/Listings/:id", wrapAsync(async (req, res) => {


    const { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/show", { listing });

}));

//create Route 

app.post("/Listings", validateListing, wrapAsync(async (req, res) => {


    const newListing = new Listing(req.body.Listings);

    await newListing.save();

    res.redirect("/Listings");
}));




app.put("/Listings/:id", validateListing, wrapAsync(async (req, res) => {

    if (!req.body.Listings) {
        new ExpressError(400, "Invalid listing data");
    }


    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, {
        ...req.body.Listings,

    });

    res.redirect("/Listings");


}));

app.get("/Listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/update", { listing });

}));

app.delete("/Listings/:id", wrapAsync(async (req, res) => {

    const { id } = req.params;
    const result = await Listing.findByIdAndDelete(id);
    console.log(result);
    res.redirect("/Listings")

}))





// app.get("/testListing" , async (req , res )=>{
// let SampleListing  = new Listing ({
//     title : "My New Villa" , 
//     descripton : "By the beach",
//     price: 1200 ,
//     location : "Calangute , Goa ",
//     Country : "India" 

// });

// await SampleListing.save();
// console.log("sample was Saved ");
// res.send("successful testuing ");



// })

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode, message } = err;

    res.render("error.ejs", { message });
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");


})

