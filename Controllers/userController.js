const {
	createStory,
	getAllStories,
	getAllBookmrkStories,
	getUserStory,
	updateStory,
} = require("../Services/userService");

//adding story
const addStory = async (req, res, next) => {
	try {
		const { category, slides } = req.body;
		const { user } = req;
		//const userId = req.user; // Extract userId from req.user
		//const addedBy = user.userId;
		const addedBy = req.user;

		const story = await createStory({ addedBy, category, slides });
		res.status(201).json({ message: "Story added successfully", data: story });
	} catch (err) {
		next(err);
	}
};

//get all stories
const getAlluserStories = async (req, res, next) => {
	try {
		//const { user } = req;
		const userId = req.user; // Extract userId from req.user
		
		const { page } = req.query;
		const stories = await getAllStories({ userId, page });
		res
			.status(200)
			.json({ message: "Stories fetched successfully", data: stories });
	} catch (error) {
		next(error);
	}
};

//get all  stories by user id
const getUserStoryById = async (req, res, next) => {
	try {
		//const { user } = req;
		//const { userId } = user;
		const userId = req.user; // Directly access req.user since it's already the userId

		const { id: storyid } = req.params;
		const story = await getUserStory({ userId, storyid });
		res.status(200).json({
			message: "Story with given id fetched successfully",
			data: story,
		});
	} catch (error) {
		next(error);
	}
};

//get updated story by id
const updatedStoryById = async (req, res, next) => {
	try {
		// const { user } = req;
		// const { userId } = user;
		const userId = req.user; // Directly access req.user as it's already the userId

		const { id: storyid } = req.params;
		const { category, slides } = req.body;
		const story = await updateStory({ userId, storyid, category, slides });
		res
			.status(200)
			.json({ message: "Story updated successfully", data: story });
	} catch (error) {
		next(error);
	}
};

//get all bookmark stories
const getAllUserBookmarks = async (req, res, next) => {
	try {
		// const { user } = req;
		// const { userId } = user;
		const userId = req.user; // Directly access req.user as it's already the userId

		const { page } = req.query;
		const bookmarkStories = await getAllBookmrkStories({ userId, page });
		res.status(200).json({
			message: "Bookmarks fetched successfully",
			data: bookmarkStories,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	addStory,
	getAlluserStories,
	getUserStoryById,
	getAllUserBookmarks,
	updatedStoryById,
};
