const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    //Index Route
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        //nested population
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not Exist!");//flash message
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();
    // console.log(response.body.features[0].geometry);//mapbox response
    // res.send("Done!");

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "....", filename);
    const newListing = new Listing(req.body.listing);//it gives an instance
    newListing.owner = req.user._id;//assigning userId to owner
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    // let savedListing = await newListing.save();
    // console.log(savedListing);

    req.flash("success", "New Listing Created!");//flash message
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not Exist!");//flash message
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    //cloudinary API, image quality degrade
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // //authorization
    // let listing = await Listing.findById(id);
    // if (!listing.owner.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You don't have permission to Edit!");
    //     //if not return then further operations will performed
    //     return res.redirect(`/listings/${id}`);
    // }

    //if req.file is undefined then also upadation should be performed 
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });//deconstructing
    // console.log(req.file);
    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteHotel = await Listing.findByIdAndDelete(id);
    console.log(deleteHotel);
    req.flash("success", "Listing Deleted!");
    res.redirect(`/listings`);
};