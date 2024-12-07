const Review = require("./model/reveiw.js");
const asyncWrap = require("./utils/asyncWrap.js");
const { listingSchema } = require("./schemaValidation.js");
const expressError = require("./utils/expressError.js");
module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must have loged in");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.isReviewAuthor = asyncWrap(async (req, res, next) => {
  const { id, reviewid } = req.params;
  let review = await Review.findById(reviewid);
  console.log(review.author);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you do not have to acess to delete that review");
    return res.redirect(`/listing/${id}`);
  }
  next();
});

module.exports.validateListing = (req, res, next) => {
  const validateSchema = listingSchema.validate(req.body);

  if (validateSchema.error) {
    throw new expressError(400, validateSchema.error);
  } else {
    next();
  }
};
