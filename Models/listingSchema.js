const mongoose = require("mongoose");
const listingSchema = mongoose.Schema({
  _id: String,
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
});

module.exports = mongoose.model("Listing", listingSchema);
