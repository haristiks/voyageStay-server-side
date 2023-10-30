const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");

module.exports = {
  //
  // Create a user with name, email, username (POST /api/users/auth/signup)
  //
  userCreation: async (req, res) => {
    const { data } = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 12);
    await user.create({
      name: data.name,
      email: data.email,
      hashedPassword,
    });
    res.status(201).json({
      status: "success",
      message: "user registration successfull.",
    });
  },
};
