//reconstructing reviews using express routes

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");//relative path ..
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// //defining function for validating schema using joi
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);//joi validation
//     if (error) {//if error exist in joi
//         let errMsg = error.details.map((el) => el.message).join(', ');//combining addtional details
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// }

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Review- DELETE Route
router.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;