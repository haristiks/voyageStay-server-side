const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 8000;
const userRouter = require("./Routes/userRoutes");
mongoose.connect("mongodb://127.0.0.1:27017/Voyage-Stay");
const ErrorHandler = require("./Middlewares/ErrorHandle");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);


app.use(ErrorHandler);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is Running on PORT: ${PORT}`);
});