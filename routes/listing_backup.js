//before router.route

//reconstructing listings path using express routes

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");//relative path
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//requiring controller
const lisitingController = require("../controllers/listings.js");

// //defining function for validating schema using joi
// const validateListing = (req, res, next) => {
//     let { error } = lisitingSchema.validate(req.body);//joi validation
//     if (error) {//if error exist in joi
//         let errMsg = error.details.map((el) => el.message).join(', ');//combining addtional details
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// }

//before controllers
// router.get("/", wrapAsync(async (req, res) => {
//     //Index Route
//     const allListings = await Listing.find({});
//     // console.log(allListings);
//     res.render("listings/index.ejs", { allListings });
// }));

router.get("/", wrapAsync(lisitingController.index)
    //index route
);

//New Route
router.get("/new", isLoggedIn, lisitingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(lisitingController.showListing));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(lisitingController.createListings));

//Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(lisitingController.renderEditForm));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(lisitingController.updateListing));

//Delete Route
router.delete("/:id/", isLoggedIn, isOwner, wrapAsync(lisitingController.destroyListing));

module.exports = router;