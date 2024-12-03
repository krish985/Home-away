const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const {isLogedIn,isReviewAuthor} = require('../middleware.js');
const reviewController = require('../controllers/review.js');

// creating all pages individual reveiw routes
router.post(
  "/reviews",
  isLogedIn,
  asyncWrap(reviewController.reviewPost)
);

// INDIVIDUAL REVIEWS DELETE ROUTE.
router.delete(
  "/review/:reviewid",
  isLogedIn,
  isReviewAuthor,
  asyncWrap(reviewController.reviewDelete)
);

module.exports = router;
