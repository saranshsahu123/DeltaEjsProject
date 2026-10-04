const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ;

main().then(() => {
    console.log("connected to DB ");
}).catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const ownerId = new mongoose.Types.ObjectId("6ac141250630dd831d129731");

    const dataWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: ownerId
    }));

    await Listing.insertMany(dataWithOwner);

    console.log("data was initialized");
   
    mongoose.connection.close();
};

initDB();