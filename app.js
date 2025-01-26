const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//to show favicon
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, '/public/images', 'logo.ico')))


// const wrapAsync = require("./utils/wrapAsync.js");
// const Listing = require("./models/listing.js")
// const { lisitingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URl = "mongodb://127.0.0.1:27017/aasaan_aavaas";
// const dbURL=MONGO_URl;
const dbURL = process.env.ATLASDB_URL;

async function main() {
    // await mongoose.connect(MONGO_URl);
    await mongoose.connect(dbURL);
}

app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//mongo session
const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});
store.on("error", () => {
    console.log(`Error in Mongo Session Store: ${err}`);

});

const sessionOptions = {
    store: store,//mongo session pass
    //can be written as store
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //after this much of milliseconds
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,//provides security
    }
};

//so that no one can send request from APIs
// app.get("/", (req, res) => {
//     res.send("Namaste!");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//creating middleware for flashing message
//creating middleware for creating locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// //demo User
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "chiragyadav916@gmail.com",
//         username: "chiragyadav916"
//     });
//     //register method save fakeUser in DB
//     let registeredUser = await User.register(fakeUser, "Chirag1690y@");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    });

//Before Express Router

// //Index Route
// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     // console.log(allListings);
//     res.render("listings/index.ejs", { allListings });
// }));

// //New Route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// //Show Route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
// }));

// //Create Route
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
//     //let listing = req.body;//data is in JS object 

//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Send valid data for listing");
//     // }

//     // let result=listingSchema.validate(req.body);
//     // console.log(result);

//     // let listing = req.body.listing;
//     // const newListing = new Listing(listing);//it gives an instance

//     // let result = lisitingSchema.validate(req.body);//joi validation
//     // console.log(result);
//     // if (result.error) {//if error exist in joi
//     //     throw new ExpressError(400, result.error);
//     // }

//     // console.log(req.body);

//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Send valid data for listing");//custom error message
//     // }

//     const newListing = new Listing(req.body.listing);//it gives an instance
//     // if (!newListing.location) {
//     //     throw new ExpressError(400, "Location is missing");
//     // }

//     await newListing.save();
//     res.redirect("/listings");
// }));

// //Edit Route 
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// }));

// //Update Route
// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Send valid data for updation");
//     // }
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });//deconstructing
//     res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// app.delete("/listings/:id/", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deleteHotel = await Listing.findByIdAndDelete(id);
//     console.log(deleteHotel);
//     res.redirect(`/listings`);
// }));

////Review- POST Route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
// }));

// //Review- DELETE Route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${listing._id}`);
// }));

app.all("*", (req, res, next) => {
    //If Route not match
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