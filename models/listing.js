// delecaring schema for Listing

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const lisitingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [//review model
        {
            type: Schema.Types.ObjectId, //storing object for particular reviews
            ref: "Review"//reference is review model
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

//creating middleware for deleting all reviews assocaited to particular listing
lisitingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {//if any listing is come
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("Listing", lisitingSchema);
module.exports = Listing;