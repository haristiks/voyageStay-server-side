const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    
    const User = await user.findOne({ email:email });
    if (!User) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    if (!password || !User.password) {
      return res.status(400).json({ status: "error", message: "Invalid input" });
    }
    
    const checkPass = await bcrypt.compare(password, User.password);
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
    res
      .status(200)
      .json({ status: "success", message: "Login successful", data: token, user:User });
  },
};
