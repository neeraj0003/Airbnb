require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async (req, res) => {
  await Listing.deleteMany({});

  let i = 0;
  for (let listing of initData.data) {
    let response = await geocodingClient
      .forwardGeocode({
        query: listing.location + `, ${listing.location}`,
        limit: 1,
      })
      .send();

    listing.geometry = response.body.features[0].geometry;
    initData.data[i++] = listing;
  }

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "666f27fcb156a182ceeef494",
  }));

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
// 6656ca2098ff82c0d34a12ed
