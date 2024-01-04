const user = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { joiUserLoginSchema } = require("../Models/validationSchema");

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
        expiresIn: 100000,
      }
    );

    const { hashedPassword, ...resp } = User._doc;

    res.status(200).cookie("accessToken",token,{
			sameSite: 'strict',
			path: '/',
      httpOnly: true,
		}).json({
      status: "success",
      message: "Login successful cookie initialized",
      ...resp,
    });
  },
};
