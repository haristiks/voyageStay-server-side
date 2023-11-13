const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PropertyListing = require("../Models/listingSchema");
const Reservations = require("../Models/reservationSchema");

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

  addToFavorites: async (req, res) => {
    const id = req.params.id;
    const { listingId } = req.body;

    const User = await user.findOne({ _id: id });
    if (!User) {
      res.status(404).json({ status: "error", message: "User not found" });
    }

    await user.updateOne(
      { _id: id },
      { $addToSet: { favoriteIds: listingId } }
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

    const User = await user.findOne({ _id: id });
    if (!User) {
      res.status(404).json({ status: "error", message: "User not found" });
    }

    await user.updateOne({ _id: id }, { $pull: { favoriteIds: listingId } });

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
      res.status(404).json({ status: "error", message: "User not found" });
    }

    const reservationId = await Reservations.create({
      userId: id,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    await user.updateOne(
      { _id: id },
      { $addToSet: { reservations: reservationId } }
    );

    res.status(201).json({
      status: "success",
      message: "Reservation successfull.",
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
      res.status(404).json({
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

      res.status(200).json({
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
};
