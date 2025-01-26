//before express router

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const { lisitingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const MONGO_URl = "mongodb://127.0.0.1:27017/aasaan_aavaas";
async function main() {
    await mongoose.connect(MONGO_URl);
}

app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//defining function for validating schema using joi
const validateListing = (req, res, next) => {
    let { error } = lisitingSchema.validate(req.body);//joi validation
    if (error) {//if error exist in joi
        let errMsg = error.details.map((el) => el.message).join(', ');//combining addtional details
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//defining function for validating schema using joi
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);//joi validation
    if (error) {//if error exist in joi
        let errMsg = error.details.map((el) => el.message).join(', ');//combining addtional details
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    });

app.get("/", (req, res) => {
    res.send("Welcome");
});

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    //let listing = req.body;//data is in JS object 

    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    // let result=listingSchema.validate(req.body);
    // console.log(result);

    // let listing = req.body.listing;
    // const newListing = new Listing(listing);//it gives an instance

    // let result = lisitingSchema.validate(req.body);//joi validation
    // console.log(result);
    // if (result.error) {//if error exist in joi
    //     throw new ExpressError(400, result.error);
    // }

    // console.log(req.body);

    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");//custom error message
    // }

    const newListing = new Listing(req.body.listing);//it gives an instance
    // if (!newListing.location) {
    //     throw new ExpressError(400, "Location is missing");
    // }

    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route 
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for updation");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });//deconstructing
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id/", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteHotel = await Listing.findByIdAndDelete(id);
    console.log(deleteHotel);
    res.redirect(`/listings`);
}));

//Review- POST Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//Review- DELETE Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${listing._id}`);
}));

//If Route not match
app.all("*", (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'));
});

//Custom Error Handlers
app.use((err, req, res, next) => {
    // console.log(err)
    let { statusCode = 500, message = "Something Went Wrong!" } = err;//default value
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
    // res.send("Something went wrong!");
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new title",
//         description: "by the beach",
//         price: 1200,
//         location: "goa"
//     });
//     await sampleListing.save();
//     console.log("Saved sample");
//     res.send("Successful testing");
// });

const port = 8080;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});