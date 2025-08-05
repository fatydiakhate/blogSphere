const express = require("express");
const route = express.Router();
const authController = require("../controllers/AuthController");



route.post("/registre", authController.registre);
route.post("/login", authController.login);
route.get("/profile", authController.profile);
route.put("/profile", authController.updateProfile); // méthode PUT pour mise à jour

route.post("/logout", authController.logout);




module.exports = route;