const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PropertyListing = require("../Models/listingSchema");
const Reservations = require("../Models/reservationSchema");
const Favorite = require("../Models/favoritesSchema");
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
  //User login    (POST api/users/auth/login)
  //
  userLongin: async (req, res) => {
    const { email, password } = req.body;

    const User = await user.findOne({ email: email });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    if (!password || !User.hashedPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid input" });
    }

    const checkPass = await bcrypt.compare(password, User.hashedPassword);
    if (!checkPass) {
      res.status(400).json({ status: "error", message: "password incorrect" });
    }
    const token = jwt.sign(
      { email: User.email },
      process.env.USER_ACCESS_TOKEN_SECRET,
      {
        expiresIn: 100000,
      }
    );

    const resp = { ...User._doc };

    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken: token,
      ...resp,
    });
  },
  //
  //
  //
  createListings: async (req, res) => {
    const id = req.params.id;
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

    const property = await PropertyListing.create({
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      userId: id,
      price: parseInt(price, 10),
    });

    await user.updateOne({ _id: id }, { $push: { listings: property._id } });

    res.status(201).json({
      status: "success",
      message: "Listing created Successfully.",
      listing: property,
    });
  },
  //
  //
  //
  deleteListing: async (req, res) => {
    const listId = req.params.listingId;
    const id = req.params.id;

    const User = await user.findOne({ _id: id });
    if (!User) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    if (User.listings.includes(listId)) {
      await PropertyListing.findByIdAndDelete({ _id: listId });
      await user.updateOne({ _id: id }, { $pull: { listings: listId } });

      res.status(200).json({
        status: "success",
        message: "property deleted successfully",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Property not found",
      });
    }
  },
  //
  //
  //
  addToFavorites: async (req, res) => {
    const id = req.params.id;
    const { listingId } = req.body;

    const User = await user.findOne({ _id: id });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const favorite = await Favorite.create({ userId: id, listingId });
    await user.updateOne({ _id: id }, { $addToSet: { favoriteIds: favorite } });

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

    const User = await user.findOne({ _id: id });
    if (!User) {
      res.status(404).json({ status: "error", message: "User not found" });
      return; // Exit the function if the user is not found
    }

    const favorite = await Favorite.findOne({ userId: id, listingId });
    if (!favorite) {
      res.status(404).json({ status: "error", message: "Favorite not found" });
      return; // Exit the function if the favorite is not found
    }
    await user.updateOne({ _id: id }, { $pull: { favoriteIds: favorite._id } });
    await Favorite.deleteOne({ userId: id, listingId: listingId });

    res.status(201).json({
      status: "success",
      message: "Removed from Favorites.",
    });
  },
  //
  //
  //
  reservation: async (req, res) => {
    const id = req.params.id;
    const { listingId, startDate, endDate, totalPrice } = req.body;

    const User = await user.findOne({ _id: id });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const reservationId = await Reservations.create({
      userId: id,
      listingId,
      startDate,
      endDate,
      totalPrice,
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
      success_url: `http://localhost:3000/paymentsuccess?rid=${reservationId._id}`,
      cancel_url: "http://localhost:3000/paymentfailed",
    });

    console.log("session :", session);

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
    const userId = req.params.id;
    const reservation = await Reservations.findOne({ _id: reservId });
    if (!reservation) {
      return res.status(404).json({
        status: "error",
        message: "no reservation found",
      });
    }

    if (reservation.userId == userId) {
      await Reservations.findByIdAndDelete({ _id: reservId });
      await user.updateOne(
        { _id: userId },
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
    const id = req.params.id;
    const favorites = await Favorite.find({ userId: id }).populate("listingId");
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
};
