const express = require("express");
const trimRequest = require("trim-request");
const router = express.Router();
const { register, login, logout } = require("../Controllers/authController");

router.route("/register").post(trimRequest.all, register);
router.route("/login").post(trimRequest.all, login);
router.route("/logout").post(trimRequest.all, logout);

module.exports = router;

//trim-request --> middleware package that trims white spaces from the request body
