const mongoose = require("mongoose");
const listingSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    imageSrc: [String],
    category: String,
    roomCount: Number,
    bathroomCount: Number,
    guestCount: Number,
    locationValue: String,
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    price: Number,
    isDeleted: { type: Boolean, default: false },
    adminApproved: { type: Boolean, default: false },
    adminDeleted: { type: Boolean, default: false },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Listing", listingSchema);
