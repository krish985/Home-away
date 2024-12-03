const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./reveiw.js");
const User = require('./user.js');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
    maxLength: 150,
  },
  image: {
    filename : String,
    url : String
  },
  price: {
    type: Number,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : 'Review'
    }
  ],
  owner : {
      type : Schema.Types.ObjectId,
      ref : 'User',
  }
});

listingSchema.post('findOneAndDelete',async (listing)=>{
  if(listing){
    await Review.deleteMany({_id : listing.reviews});
  }
})
const Listing = mongoose.model('Listing',listingSchema);

module.exports = Listing;
