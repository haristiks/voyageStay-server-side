const mongoose = require("mongoose");
const listingSchema = mongoose.Schema({
  title: String,
  description: String,
  imageSrc: String,
  createdAt: { type: Date, default: Date.now },
  category: String,
  roomCount: Number,
  bathroomCount: Number,
  guestCount: Number,
  locationValue: String,
  userId: { type: String, ref: "User" },
  price: Number,
  isDeleted:{type:Boolean, default:false},
  adminApproved:{type:Boolean, default:false},
  adminDeleted : {type:Boolean, default:false},
});

module.exports = mongoose.model("Listing", listingSchema);
