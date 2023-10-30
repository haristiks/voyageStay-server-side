const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  _id: String,
  name: String,
  email: { type: String, unique: true },
  emailVerified: Date,
  image: String,
  hashedPassword: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  favoriteIds: [{ type: String }],

  accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  listings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  reservations: [{ type: Schema.Types.ObjectId, ref: "Reservation" }],
});

module.exports = mongoose.model("User", userSchema);
