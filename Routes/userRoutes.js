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
router.delete("/:id/reservations/:reservId",verifyToken, TryCatch(controller.cancelReservation))
router.delete("/:id/listings/:listingId",verifyToken, TryCatch(controller.deleteListing))
router.get("/:id/favorites", verifyToken, TryCatch(controller.getFavorites))

router.post("/:id/reservations",verifyToken, TryCatch(controller.reservation))

router.post('/:id/:reservId/payment',verifyToken, TryCatch(controller.payment))
router.get('/payment/success', TryCatch(controller.sucess))
router.get('/payment/cancel', TryCatch(controller.cancel))


module.exports = router;
