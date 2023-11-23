const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  emailVerified: Date,
  image: String,
  hashedPassword: String,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  favoriteIds: [{ type: mongoose.Schema.ObjectId, ref: "Favorite" }],
  accounts: [{ type: mongoose.Schema.ObjectId, ref: "Account" }],
  listings: [{ type: mongoose.Schema.ObjectId, ref: "Listing" }],
  reservations: [{ type: mongoose.Schema.ObjectId, ref: "Reservation" }],
  adminSuspended: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);

//IMPLIMENT SEPERATE SCHEMA FOR FAVORITES
