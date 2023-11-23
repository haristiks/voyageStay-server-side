const PropertyListing = require("../Models/listingSchema");
const Reservations = require("../Models/reservationSchema");
const User = require("../Models/userSchema");
const Favorite = require("../Models/favoritesSchema");

module.exports = {
  getAllUsers: async (req, res) => {
    const users = await User.find({ role: "user" }).populate([
      "favoriteIds",
      "listings",
      "reservations",
    ]);

    if (!users) {
      return res.status(404).json({
        status: "failure",
        status_code: 404,
        message: "No user data found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Users fetch Successfull",
      data: users,
    });
  },
  //
  //
  getProperties: async (req, res) => {
    const listings = await PropertyListing.find().populate("userId");
    if (!listings) {
      return res.status(404).json({
        status: "failure",
        status_code: 404,
        message: "Data not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Property Listing fetch Successfull",
      data: listings,
    });
  },
  //
  //
  getReseservations: async (req, res) => {
    const ReservationList = await Reservations.find().populate([
      "listingId",
      "userId",
    ]);

    if (!ReservationList) {
      return res.status(404).json({
        status: "failure",
        status_code: 404,
        message: "No reservation yest.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Reservations fetch Successfull",
      data: ReservationList,
    });
  },
  //
  //
  getFavorites: async (req, res) => {
    const favorites = await Favorite.find().populate(["listingId", "userId"]);
    if (!favorites) {
      res.status(404).json({
        status: "error",
        message: "No favorites found",
      });
    }

    res.status(200).json({
      status: "success",
      message: " successfully fetched favorites",
      data: favorites,
    });
  },
  //
  //
  mangeUser: async (req, res) => {
    const id = req.params.id;
    const { adminSuspended } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "No Such User",
      });
    }

    await User.findByIdAndUpdate(id, { $set: { adminSuspended } });

    res.status(201).json({
      status: "success",
      message: " successfully updated user",
    });
  },
  //
  //
  manageProperties: async (req, res) => {},
  //
  //
  manageReservations: async (req, res) => {},
  //
  //
};
