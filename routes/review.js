const express = require('express');
// imp
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/catchError');
const Review = require("../controllers/review")
const { isLoggedIn, isValidId, isAuthorizeRev, validaterev, campExist } = require("../utils/middleware")


router.post("", isValidId, campExist, isLoggedIn, validaterev, wrapAsync(Review.createReview));

router.post("/:reviewid", isValidId, campExist, isLoggedIn, isAuthorizeRev, wrapAsync(Review.deleteReview));

module.exports = router;