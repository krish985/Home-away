const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const { isLogedIn,validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../utils/cloudConfig.js");
const upload = multer({ storage });
const listingController = require("../controllers/listing.js");


// CREATING ROUTE USING RESTFULL API.


// add new listing route.

router.get("/new", isLogedIn,listingController.listingNewShowRoute);

router.post(
  "/new",
  isLogedIn,
  validateListing,
  upload.single("image"),
  asyncWrap(listingController.listingNewPostRoute)
);

// show all listing route.
router.get("/", asyncWrap(listingController.listingShowRoute));

router.get("/:id", asyncWrap(listingController.listingShowIndividualRoute));


// edit listing route.
router.get("/:id/edit", asyncWrap(listingController.listingEditShowRoute));

router.put(
  "/:id",
  isLogedIn,
  validateListing,
  upload.single("image"),
  asyncWrap(listingController.listingEditRoute)
);

// delete listing.
router.delete(
  "/:id/delete",
  isLogedIn,
  asyncWrap(listingController.listingDeleteRoute)
);

module.exports = router;
