const express = require("express");
const trimRequest = require("trim-request");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const {
	getStoriesByCategory,
	getUserStoryById,
	likeStoryById,
	bookmrkStoryById,
} = require("../Controllers/storyController");

//Get stories by categories - no auth required
router.route("/").get(trimRequest.all, getStoriesByCategory);

//Get a single story by Id - no auth required
router.route("/:id").get(trimRequest.all, getUserStoryById);

//Like or unLike a story by Id - auth required
router.route("/:id/like").put(trimRequest.all, authMiddleware, likeStoryById);

//Bookmark or unBookmark a story by Id - auth required
router
	.route("/:id/bookmark")
	.put(trimRequest.all, authMiddleware, bookmrkStoryById);

module.exports = router;
