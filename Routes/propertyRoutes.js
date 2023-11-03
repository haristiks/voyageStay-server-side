const express = require("express");
const router = express.Router();
const controller = require("../Controllers/propertyController");
const TryCatch = require("../Middlewares/tryCatchMiddleware");

router.get("/listings", TryCatch(controller.getAllListings));

module.exports = router;
