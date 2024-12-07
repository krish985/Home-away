const Review = require("../model/reveiw.js");
const Listing = require("../model/listing.js");

module.exports.reviewPost = async (req, res) => {
  let { id } = req.params;
  let { rating, comment } = req.body;
  const listing = await Listing.findById(id);
  const newReview = new Review({
    feedback: comment,
    rating: rating,
  });
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listing/${id}`);
};

module.exports.reviewDelete = async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","your review deleted succesfull")
    res.redirect(`/listing/${id}`);
  }
