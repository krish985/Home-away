const expressError = require("../utils/expressError.js");
const Listing = require("../model/listing.js");

module.exports.listingNewShowRoute = (req, res) => {
  res.render("listings/newListing.ejs");
};

module.exports.listingNewPostRoute = async (req, res) => {
  let url = req.file.path;
  let fileName = req.file.filename;
  let { title, description, price, location, country } = req.body;

  const newListing = new Listing({
    title: title,
    description: description,
    // image: image,
    price: price,
    location: location,
    country: country,
  });
  newListing.owner = req.user._id;
  newListing.image = { fileName, url };
  await newListing.save()
  req.flash("success", "hey your listing added succesfully!");

  res.redirect("/listing");
};

module.exports.listingShowRoute = async (req, res, next) => {
  let listings = await Listing.find();
  res.render("listings/homeListing.ejs", { listings });
};

module.exports.listingShowIndividualRoute = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    next(new expressError(400, "listing not found"));
  }
  res.render("listings/individualListing.ejs", {
    listing,
    owner: listing.owner.username,
  });
};

module.exports.listingEditShowRoute = async (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    next(new expressError(400, "invalid listing id"));
  }
  let listing = await Listing.findById(id);
  const imageTransformation = listing.image.url.replace(
    "/upload",
    "/upload/w_300"
  );
  res.render("listings/editListing.ejs", { listing, imageTransformation });
};

module.exports.listingEditRoute = async (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    next(new expressError(400, "invalid listing id"));
  }

  let { title, description, price, location, country } = req.body;
  const upadateListing = await Listing.findByIdAndUpdate(id, {
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let fileName = req.file.fileName;
    upadateListing.image = { fileName, url };
    await upadateListing.save();
  }
  req.flash("success","your listing updated succesfull")
  res.redirect(`/listing/${id}`);
};

module.exports.listingDeleteRoute = async (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    next(new expressError(400, "invalid listing id"));
  }
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
};
