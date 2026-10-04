const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js")


const listingSchema = new Schema ({
    title : {
        type : String ,
        required : true
    },
    description : String,
    image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAPf_062JKWOBQr9rKxfyjLtlwzCn6Wwx_fJ6vQDIAgQ&s=10"
    }
} ,
    price : Number ,
    location : String , 
    country : String ,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref : "Review",
        }

    ],
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}
});


listingSchema.post("findOneAndDelete" , async(listing) => {

    if(listing){

        await Review.deleteMany( _id ,{reviews : {$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing" , listingSchema); 

module.exports = Listing;