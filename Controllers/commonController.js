const PropertyListing = require("../Models/listingSchema");
const Reservations = require("../Models/reservationSchema");
const User = require("../Models/userSchema");

module.exports = {
  getAllListings: async (req, res) => {
    const listings = await PropertyListing.find();
    if (!listings) {
      return res.status(404).json({
        status: "failure",
        status_code: 404,
        message: "Data not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Property Listing fetch Successfull",
      data: listings,
    });
  },
  //
  //
  //
  getListingById: async (req, res) => {
    const id = req.params.listingId;
    const listing = await PropertyListing.findOne({ _id: id });
    if (!listing) {
      return res.status(404).json({
        status: "failure",
        status_code: 404,
        message: "Data not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Property Listing fetch Successfull",
      data: listing,
    });
  },
  //
  //
  //
  getReservations: async (req, res) => {
    const ReservationList = await Reservations.find().populate("listingId");

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
  //
  ReservationByListingId: async (req, res) => {
    const Id = req.params.listingId;
    const reservations = await Reservations.find({ listingId: Id });
    if (!reservations) {
      return res.status(404).json({
        status: "failure",
        status_code: 404,
        message: "No reservation yest.",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Reservations fetch Successfull",
      data: reservations,
    });
  },
  //
  //
  //
  getUsers: async (req, res) => {
    const users = await User.find();

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
  //
  getUserById: async (req, res) => {
    const id= req.params.id;
    const user = await User.findOne({_id:id})
    if (!user) {
      return res.status(404).json({
        status: "failure",
        status_code: 404,
        message: "No user data found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "fetch user Successfull",
      data: user,
    });
  },
};
