const express = require("express");
const router = express.Router();
const controller = require("../Controllers/userController");
const TryCatch = require("../Middlewares/tryCatchMiddleware");
const verifyToken = require("../Middlewares/userAuthMiddleware");

router.post("/auth/signup", TryCatch(controller.userCreation));
router.get("/:userId/profile",verifyToken,TryCatch(controller.getUserDetails))
router.put("/update",verifyToken,TryCatch(controller.userUpdation))
router.post("/listings", verifyToken, TryCatch(controller.createListings));
router.put("/listings/:listingId", verifyToken, TryCatch(controller.updateListings));
router.post("/favorites",verifyToken,TryCatch(controller.addToFavorites));
router.put("/favorites",verifyToken,TryCatch(controller.removeFavorites));
router.delete("/listings/:listingId",verifyToken, TryCatch(controller.deleteListing))
router.get("/favorites", verifyToken, TryCatch(controller.getFavorites))
router.get("/:userId/bookingsrecieved",verifyToken,TryCatch(controller.getBookingsOnUserListings))

router.post("/reservations",verifyToken, TryCatch(controller.reservation))
router.delete("/reservations/:reservId",verifyToken, TryCatch(controller.cancelReservation))
router.patch('/:id/conformreservation', TryCatch(controller.confirmReservation))



module.exports = router;
