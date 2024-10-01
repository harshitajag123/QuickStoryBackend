const {
	getStories,
	getUserStory,
	likeStory,
	bookmarkStory,
} = require("../Services/storyService");

const getStoriesByCategory = async (req, res, next) => {
	try {
		const { category, page } = req.query;
		const stories = await getStories({ category, page });
		res
			.status(200)
			.json({ message: "Stories fetched successfully", data: stories });
	} catch (error) {
		next(error);
	}
};

const getUserStoryById = async (req, res, next) => {
	try {
		const { id: storyid } = req.params; // Get story ID from URL params
		const story = await getUserStory(storyid); // Pass storyid directly
		res.status(200).json({
			message: "Story with given id fetched successfully",
			data: story,
		});
	} catch (error) {
		next(error); // Error handling
	}
};

const likeStoryById = async (req, res, next) => {
	try {
		// const { user } = req;
		// const { userId } = user;
		const userId = req.user; // No need to destructure, use req.user directly
		const { id: storyid } = req.params;
		const { story, msg } = await likeStory({ userId, storyid });
		res.status(200).json({ success: msg, data: story });
	} catch (error) {
		next(error);
	}
};

const bookmrkStoryById = async (req, res, next) => {
	try {
		// const { user } = req;
		// const { userId } = user;
		const userId = req.user; // No need to destructure, use req.user directly
		const { id: storyid } = req.params;
		const { story, msg } = await bookmarkStory({ userId, storyid });
		res.status(200).json({ success: msg, data: story });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getStoriesByCategory,
	getUserStoryById,
	likeStoryById,
	bookmrkStoryById,
};
