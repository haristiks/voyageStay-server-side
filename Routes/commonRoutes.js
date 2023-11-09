const express = require("express");
const router = express.Router();
const controller = require("../Controllers/commonController");
const TryCatch = require("../Middlewares/tryCatchMiddleware");

router.get("/listings", TryCatch(controller.getAllListings));
router.get('/reservations',TryCatch(controller.getReservations))
router.get('/users',TryCatch(controller.getUsers))

module.exports = router;
