const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 8000;
const user = require("./Models/userSchema");

const userRouter = require("./Routes/userRoutes");

mongoose.connect(process.env.MONGO_URL).then(async () => {
  console.log("database connected");
  const admin = await user.findOne({ role: "admin" });
  if (!admin) {
    await user.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });
  }
});

const ErrorHandler = require("./Middlewares/ErrorHandler");
const commonRouter = require("./Routes/commonRoutes");
const authRoute = require("./Routes/authRoute");
const adminRoute = require("./Routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRouter);
app.use("/api/data", commonRouter);
app.use("/api/admin", adminRoute);

app.use(ErrorHandler);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is Running on PORT: ${PORT}`);
});
