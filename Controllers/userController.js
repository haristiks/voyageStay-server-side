const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PropertyListing = require("../Models/listingSchema");

module.exports = {
  //
  // Create a user with name, email, username (POST /api/users/auth/signup)
  //
  userCreation: async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
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
    console.log(req.body);

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
      { username: User.username },
      process.env.USER_ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken: token,
      ...User,
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
      locationValue: location,
      userId: id,
      price,
    });

    await user.updateOne({ _id: id }, { $push: { listings: property._id } });

    res.status(201).json({
      status: "success",
      message: "Listing created Successfully.",
    });
  },
};
