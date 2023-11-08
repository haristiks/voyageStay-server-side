const PropertyListing = require("../Models/listingSchema");
const Reservations = require("../Models/reservationSchema");

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
  getReservations: async (req, res) => {
    const ReservationList = await Reservations.find();

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
};
