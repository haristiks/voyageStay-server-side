const express = require("express");
const router = express.Router();
const controller = require("../Controllers/adminController");
const TryCatch = require("../Middlewares/tryCatchMiddleware");
const verifyToken = require("../Middlewares/userAuthMiddleware");

router.get("/users", verifyToken, TryCatch(controller.getAllUsers));
router.get("/properties", verifyToken, TryCatch(controller.getProperties));
router.get("/reservations",verifyToken, TryCatch(controller.getReseservations));
router.get("/favorites", verifyToken, TryCatch(controller.getFavorites));
router.patch("/users/:id", verifyToken, TryCatch(controller.mangeUser));
router.put("/properties/:id", verifyToken, TryCatch(controller.manageProperties));
router.put("/reservations/:id", verifyToken, TryCatch(controller.manageReservations));


module.exports = router;
