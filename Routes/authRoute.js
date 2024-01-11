const express = require("express");
const router = express.Router();
const controller = require("../Controllers/authController");
const TryCatch = require("../Middlewares/tryCatchMiddleware");

router.post("/login", TryCatch(controller.Login));
router.get("/logout", TryCatch(controller.Logout));
router.post("/google", TryCatch(controller.google));

module.exports = router;
