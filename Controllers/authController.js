const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");

module.exports = {
  Login: async (req, res) => {
    const { email, password } = req.body;

    const User = await user.findOne({ email: email });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    if (User.adminSuspended) {
      return res
        .status(400)
        .json({ status: "error", message: "Suspended Account" });
    }
    if (!password || !User.hashedPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid input" });
    }

    const checkPass = await bcrypt.compare(password, User.hashedPassword);
    if (!checkPass) {
      return res
        .status(400)
        .json({ status: "error", message: "password incorrect" });
    }
    const token = jwt.sign(
      { email: User.email },
      User.role == "user"
        ? process.env.USER_ACCESS_TOKEN_SECRET
        : process.env.ADMIN_ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400,
      }
    );

    const { hashedPassword, ...resp } = User._doc;

    res
      .status(200)
      .cookie("accessToken", token, {
        sameSite: "strict",
        path: "/",
        httpOnly: true,
      })
      .json({
        status: "success",
        message: "Login successful cookie initialized",
        ...resp,
      });
  },
  //
  //
  //
  Logout: async (req, res) => {
    res.status(200).clearCookie("accssToken").json({
      status: "success",
      message: "Logout Successful cookie cleared",
    });
  },
  //
  //
  //
  google: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const gtoken = jwt.sign(
        { email: user.email },
        process.env.USER_ACCESS_TOKEN_SECRET,
        { expiresIn: 86400 }
      );
      const { hashedPassword, ...resp } = user._doc;
      res
        .status(200)
        .cookie("accessToken", gtoken, {
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        })
        .json({
          status: "success",
          message: "Login successful cookie initialized",
          ...resp,
        });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const Password = await bcrypt.hash(generatedPassword, 12);
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        hashedPassword: Password,
        image: req.body.avatar,
      });

      const gtoken = jwt.sign(
        { email: user.email },
        process.env.USER_ACCESS_TOKEN_SECRET,
        { expiresIn: 86400 }
      );
      const { hashedPassword, ...resp } = newUser._doc;
      res
        .status(200)
        .cookie("accessToken", gtoken, {
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        })
        .json({
          status: "success",
          message: "Login successful cookie initialized",
          ...resp,
          password: generatedPassword,
        });
    }
  },
};
