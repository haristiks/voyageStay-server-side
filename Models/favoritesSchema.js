const mongoose = require("mongoose");
const favoriteSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
  listingId: { type: mongoose.Schema.ObjectId, ref: "Listing" },
});

favoriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
