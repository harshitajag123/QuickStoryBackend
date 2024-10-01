const createHttpError = require("http-errors");
const UserModel = require("../Models/user");
const StoryModel = require("../Models/story");

//creating story
const createStory = async ({ addedBy, category, slides }) => {
	//check if fields are provided
	if (!addedBy || !category || !slides) {
		throw createHttpError.BadRequest("Please provide all fields");
	}

	//check if slides length is valid
	if (slides.length < 3 || slides.length > 6) {
		throw createHttpError.BadRequest("Please provide min 3 and max 6 slides");
	}

	//adding slides to story
	const story = await StoryModel.create({
		addedBy,
		category,
		slides,
	});
	return story;
};

const getAllStories = async ({ userId, page, limit = 4 }) => {
	const skip = (page - 1) * limit;
	if (!userId) {
		throw createHttpError.BadRequest("Please provide user id");
	}

	const stories = await StoryModel.find({ addedBy: userId })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const totalCount = await StoryModel.countDocuments({ addedBy: userId });
	const remainingCount = totalCount - (page - 1) * limit - stories.length;
	console.log("User ID:", userId);
	console.log("Page:", page);
	console.log("Limit:", limit);
	console.log("Stories Fetched:", stories);
	console.log("Total Count:", totalCount);
	console.log("Remaining Count:", remainingCount);

	return { data: stories, remainingCount };
};

const getAllBookmrkStories = async ({ userId, page, limit = 4 }) => {
	const skip = (page - 1) * limit;
	if (!userId) {
		throw createHttpError.BadRequest("Please provide user id");
	}

	const { bookmarks } = await UserModel.findById({ _id: userId }).populate({
		path: "bookmarks",
		model: "StoryModel",
		options: { sort: { createdAt: -1 } },
	});

	const totalStories = bookmarks.length;
	const updateStories = bookmarks.slice(skip, skip + limit);
	const remainingCount = totalStories - skip - updateStories.length;

	return { data: updateStories, remainingCount: Math.max(0, remainingCount) };
};

const getUserStory = async ({ userId, storyid }) => {
	if (!userId) {
		throw createHttpError.BadRequest("Please provide user id");
	}

	if (!storyid) {
		throw createHttpError.BadRequest("Please provide story id");
	}

	const story = await StoryModel.findById({ _id: storyid });
	if (!story) {
		throw createHttpError.NotFound("Story not found");
	}
	return story;
};

const updateStory = async ({ userId, storyid, category, slides }) => {
	if (!userId) {
		throw createHttpError.BadRequest("Please provide user id");
	}
	if (!storyid) {
		throw createHttpError.BadRequest("Please provide story id");
	}

	const story = await StoryModel.findById({ _id: storyid });
	if (!story) {
		throw createHttpError.NotFound("Story not found");
	}

	if (String(story.addedBy) !== userId) {
		throw createHttpError.Unauthorized(
			"You are not authorized to update this story"
		);
	}

	const updateStory = await StoryModel.findByIdAndUpdate(
		storyid,
		{ category, slides },
		{ new: true }
	);

	return updateStory;
};

// // Export all functions
module.exports = {
	createStory,
	getAllStories,
	getAllBookmrkStories,
	getUserStory,
	updateStory,
};
