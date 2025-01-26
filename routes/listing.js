if (process.env.NODE_ENV != 'production') {
    require("dotenv").config();
}

//reconstructing listings path using express routes

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");//relative path
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//requiring controller
const lisitingController = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//group together routes with same path
router.route("/")
    //index route
    .get(wrapAsync(lisitingController.index))
    //Create Route
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,//listing is required //joi validation error if used before listing[image]
        wrapAsync(lisitingController.createListings)
    );

//New Route
router.get("/new", isLoggedIn, lisitingController.renderNewForm);

router.route("/:id")
    //Update Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(lisitingController.updateListing))
    //Show Route
    .get(wrapAsync(lisitingController.showListing))
    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(lisitingController.destroyListing));

//Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(lisitingController.renderEditForm));

module.exports = router;