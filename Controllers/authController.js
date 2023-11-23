const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const PropertyListing = require("../Models/listingSchema");
// const Reservations = require("../Models/reservationSchema");
// const Favorite = require("../Models/favoritesSchema");

module.exports = {
  //
  // Create a user with name, email, username (POST /api/users/auth/signup)
  //

  //
  //User login    (POST api/users/auth/login)
  //
  Login: async (req, res) => {
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

    if (User.adminSuspended) {
      return res
        .status(400)
        .json({ status: "error", message: "Suspended Accound" });
    }


    const checkPass = await bcrypt.compare(password, User.hashedPassword);
    if (!checkPass) {
      res.status(400).json({ status: "error", message: "password incorrect" });
    }

    // let accessToken;
    // if (User.role === "admin") {
    //   accessToken = jwt.sign(
    //     { email: User.email },
    //     process.env.ADMIN_ACCESS_TOKEN_SECRET,
    //     {
    //       expiresIn: 100000,
    //     }
    //   );
    // } else if (User.role === "user") {
    //   accessToken = jwt.sign(
    //     { email: User.email },
    //     process.env.USER_ACCESS_TOKEN_SECRET,
    //     {
    //       expiresIn: 1000,
    //     }
    //   );
    // }

    

    const accessToken = jwt.sign(
      { email: User.email },
      process.env.USER_ACCESS_TOKEN_SECRET,
      {
        expiresIn: 1000,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken,
      ...User._doc,
    });
  },
};
