const createHttpError = require("http-errors");
const StoryModel = require("../Models/story");
const UserModel = require("../Models/user");

const getStories = async ({ category, page = 1, limit = 4 }) => {
	const skip = (page - 1) * limit;
	if (!category) {
		throw createHttpError.BadRequest(" Please provide category");
	}

	const stories = await StoryModel.find({ category })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const totalCount = await StoryModel.countDocuments({ category });
	const remainingCount = totalCount - (page - 1) * limit - stories.length;

	return { data: stories, remainingCount, category };
};

const getUserStory = async (storyid) => {
	if (!storyid) {
		throw createHttpError.BadRequest("Please provide story id");
	}
	// Pass the storyid directly as a string, not an object
	const story = await StoryModel.findById(storyid);
	if (!story) {
		throw createHttpError.NotFound("Story not found");
	}
	return story;
};

const likeStory = async ({ userId, storyid }) => {
	//check if user exists
	if (!userId) {
		throw createHttpError.BadRequest("Please provide user id");
	}
	//check if story exists
	if (!storyid) {
		throw createHttpError.BadRequest("Please provide story id");
	}

	const story = await StoryModel.findById({ _id: storyid });
	if (!story) {
		throw createHttpError.NotFound("Story not found");
	}
	const indx = story.likes.indexOf(userId);
	let msg;
	//check if user already liked -- then unlike
	if (indx !== -1) {
		story.likes.splice(indx, 1);
		story.likeCount -= 1;
		msg = "Unliked successfully";
	} else {
		//else like
		story.likes.push(userId);
		story.likeCount += 1;
		msg = "Liked successfully";
	}
	await story.save();
	return { story, msg };
};

const bookmarkStory = async ({ userId, storyid }) => {
	//check if user exists
	if (!userId) {
		throw createHttpError.BadRequest("Please provide user id");
	}
	//check if story exists
	if (!storyid) {
		throw createHttpError.BadRequest("Please provide story id");
	}

	const story = await StoryModel.findById({ _id: storyid });
	if (!story) {
		throw createHttpError.NotFound("Story not found");
	}

	const indx = story.bookmarks.indexOf(userId);
	let msg;
	//check if user already bookmarked -- then unbookmark
	if (indx !== -1) {
		story.bookmarks.splice(indx, 1);
		msg = "Unbookmarked successfully";
	} else {
		//else bookmark
		story.bookmarks.push(userId);
		msg = "Bookmarked successfully";
	}

	//update the user bookmarks array
	const user = await UserModel.findById(userId);
	const indxbookmark = user.bookmarks.indexOf(storyid);
	if (indxbookmark !== -1) {
		user.bookmarks.splice(indxbookmark, 1);
	} else {
		user.bookmarks.push(storyid);
	}

	await user.save();
	await story.save();

	return { story, msg };
};

module.exports = {
	getStories,
	getUserStory,
	likeStory,
	bookmarkStory,
};
