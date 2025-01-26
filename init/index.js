// insertion of data in DB from data.js file in init folder

const mongoose = require("mongoose");
const initData = require("./data.js");//sample data
const Listing = require("../models/listing.js");//for schema

const MONGO_URL = "mongodb://127.0.0.1:27017/aasaan_aavaas";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "660d2309260ddc75212f7f77" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();