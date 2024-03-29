const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PropertyListing = require("../Models/listingSchema");
const Reservations = require("../Models/reservationSchema");
const Favorite = require("../Models/favoritesSchema");
const Promo = require("../Models/offerSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  //
  // Create a user with name, email, username (POST /api/users/auth/signup)
  //
  userCreation: async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    await user.create({
      name,
      email,
      hashedPassword,
    });
    res.status(201).json({
      status: "success",
      message: "user registration successfull.",
    });
  },
  //
  //
  getUserDetails: async (req, res) => {
    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "No user found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "user detals fetch successfull.",
      User,
    });
  },
  //
  //
  userUpdation: async (req, res) => {
    const { name, image, password } = req.body;
    // const id = req.params.id;
    const email = req.email;
    const User = await user.findOne({ email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }
    if (name) {
      await user.findByIdAndUpdate(User._id, { $set: { name } });
    }
    if (image) {
      await user.findByIdAndUpdate(User._id, { $set: { image } });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await user.findByIdAndUpdate(User._id, { $set: { hashedPassword } });
    }

    res.status(200).json({
      status: "success",
      message: "user update successful",
    });
  },
  //
  //
  //
  createListings: async (req, res) => {
    // const id = req.params.id;

    const {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      price,
    } = req.body;

    const User = await user.findOne({ email: req.email });

    const property = await PropertyListing.create({
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      userId: User._id,
      price: parseInt(price, 10),
    });

    await user.updateOne(
      { email: req.email },
      { $push: { listings: property._id } }
    );

    res.status(201).json({
      status: "success",
      message: "Listing created Successfully.",
    });
  },
  //
  //
  //
  updateListings: async (req, res) => {
    const id = req.params.listingId;

    const User = await user.findOne({ email: req.email });

    const updatedproperty = await PropertyListing.findByIdAndUpdate(id, {
      $set: {
        ...req.body,
        locationValue: location.value,
        userId: User._id,
        price: parseInt(price, 10),
      },
    });
    if (!updatedproperty) {
      return res.status(404).json({
        status: "error",
        message: "Property not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Listing updated Successfully.",
    });
  },
  //
  //
  //
  deleteListing: async (req, res) => {
    const listId = req.params.listingId;
    // const id = req.params.id;

    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    if (User.listings.includes(listId)) {
      await PropertyListing.findByIdAndDelete({ _id: listId });
      await user.updateOne(
        { email: req.email },
        { $pull: { listings: listId } }
      );

      return res.status(200).json({
        status: "success",
        message: "property deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Property not found",
      });
    }
  },
  //
  //
  //
  addToFavorites: async (req, res) => {
    // const id = req.params.id;
    const { listingId } = req.body;

    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const favorite = await Favorite.create({ userId: User._id, listingId });
    await user.updateOne(
      { email: req.email },
      { $addToSet: { favoriteIds: favorite } }
    );

    res.status(201).json({
      status: "success",
      message: "added to Favorites.",
    });
  },
  //
  //
  //
  removeFavorites: async (req, res) => {
    const id = req.params.id;
    const { listingId } = req.body;

    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
      // Exit the function if the user is not found
    }

    const favorite = await Favorite.findOne({ userId: User._id, listingId });
    if (!favorite) {
      return res
        .status(404)
        .json({ status: "error", message: "Favorite not found" });
      // Exit the function if the favorite is not found
    }
    await user.updateOne(
      { _id: User._id },
      { $pull: { favoriteIds: favorite._id } }
    );
    await Favorite.deleteOne({ userId: User._id, listingId: listingId });

    res.status(201).json({
      status: "success",
      message: "Removed from Favorites.",
    });
  },
  //
  //
  //
  reservation: async (req, res) => {
    // const id = req.params.id;
    const { listingId, startDate, endDate, totalPrice, promoCode } = req.body;

    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const promotion = await Promo.findOne({ promoCode, isDeleted: false });
    const reservationId = await Reservations.create({
      userId: User._id,
      listingId,
      startDate,
      endDate,
      totalPrice,
      romocodeAdded: promotion ? true : false,
      promocode: promotion && promotion._id,
    });

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: listingId,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/paymentsuccess?rid=${reservationId._id}`,
      cancel_url: `${process.env.CLIENT_URL}/paymentfailed`,
    });

    res.json({ id: session.id });
  },
  //
  //
  //
  confirmReservation: async (req, res) => {
    const id = req.params.id;
    const { reservId } = req.body;

    const reservation = await Reservations.findOne({ _id: reservId });

    if (!reservation) {
      return res.status(404).json({
        status: "error",
        message: "no reservation found",
      });
    }

    await Reservations.findByIdAndUpdate(reservId, {
      $set: { paymentDone: true },
    });

    await user.updateOne(
      { _id: id },
      { $addToSet: { reservations: reservId } }
    );

    res.status(200).json({
      status: "success",
      message: " Reservation conformed  successfully ",
    });
  },
  //
  //
  //
  cancelReservation: async (req, res) => {
    const reservId = req.params.reservId;
    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "no users foun",
      });
    }
    const reservation = await Reservations.findOne({ _id: reservId });
    if (!reservation) {
      return res.status(404).json({
        status: "error",
        message: "no reservation found",
      });
    }

    if (reservation.userId == User._id) {
      await Reservations.findByIdAndDelete({ _id: reservId });
      await user.updateOne(
        { _id: User._id },
        { $pull: { reservations: reservId } }
      );

      return res.status(200).json({
        status: "success",
        message: "Successfully cancelled reservation.",
      });
    }

    await Reservations.findByIdAndUpdate(
      { _id: reservId },
      { cancelledByHost: true }
    );
    await Reservations.findByIdAndDelete({ _id: reservId });
    res.status(200).json({
      status: "success",
      message: "Successfully cancelled reservation.",
    });
  },
  //
  //
  //
  getFavorites: async (req, res) => {
    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "No user found",
      });
    }
    const favorites = await Favorite.find({ userId: User._id }).populate(
      "listingId"
    );
    if (!favorites) {
      return res.status(404).json({
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
  //
  getBookingsOnUserListings: async (req, res) => {
    const User = await user.findOne({ email: req.email });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "No user found",
      });
    }
    const totalReservations = await Reservations.find().populate("listingId");

    const bookings = totalReservations.filter(
      (item) => item.listingId.userId == User._id
    );
    if (bookings.length < 1) {
      return res.status(404).json({
        status: "error",
        message: "No bookings found",
      });
    }

    res.status(200).json({
      status: "success",
      message: " successfully fetched bookings on your listings",
      data: bookings,
    });
  },
  //
  //
  //
};
