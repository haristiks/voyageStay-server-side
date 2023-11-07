const express = require("express");
const router = express.Router();
const controller = require("../Controllers/userController");
const TryCatch = require("../Middlewares/tryCatchMiddleware");
const verifyToken = require("../Middlewares/userAuthMiddleware");

router.post("/auth/signup", TryCatch(controller.userCreation));
router.post("/auth/login", TryCatch(controller.userLongin));
router.post("/:id/listings", verifyToken, TryCatch(controller.createListings));
router.post("/:id/favorites",verifyToken,TryCatch(controller.addToFavorites));
router.patch("/:id/favorites",verifyToken,TryCatch(controller.removeFavorites));

module.exports = router;
