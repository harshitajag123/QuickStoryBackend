const express = require("express");
//const trimRequest = require("trim-request");
const trimRequest = require("trim-request");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const {
	addStory,
	getAlluserStories,
	getUserStoryById,
	getAllUserBookmarks,
	updatedStoryById,
} = require("../Controllers/userController");

console.log({ addStory, getAlluserStories, getUserStoryById }); // Log imported functions

//Creating a story
router.route("/stories").post(trimRequest.all, authMiddleware, addStory);

// Get all stories
router
	.route("/stories")
	.get(trimRequest.all, authMiddleware, getAlluserStories);

// Get all bookmarks
router
	.route("/stories/bookmarks")
	.get(trimRequest.all, authMiddleware, getAllUserBookmarks);

// Get a single story by Id
router
	.route("/stories/:id")
	.get(trimRequest.all, authMiddleware, getUserStoryById);

router
	.route("/stories/:id")
	.put(trimRequest.all, authMiddleware, updatedStoryById);

module.exports = router;
