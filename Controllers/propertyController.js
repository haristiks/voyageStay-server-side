const PropertyListing = require("../Models/listingSchema");

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
};
