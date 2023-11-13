const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  userId: { type: String, ref: "User" },
  listingId: { type: String, ref: "Listing" },
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
  cancelledByHost : {type: Boolean, default:false}
});

module.exports = mongoose.model("Reservation", reservationSchema);
