const express = require("express");
const router = express.Router();
//const authRoute = require("./authRoutes");
const userRoute = require("./userRoutes");
//const storyRoute = require("./storyRoutes");

//router.use("/auth", authRoute);
router.use("/user", userRoute);
//router.use("/stories", storyRoute);

module.exports = router;
