const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name"],
		},
		password: {
			type: String,
			required: [true, "Please provide your password"],
			minLength: [
				6,
				"Please make sure your password is at least 6 characters long",
			],
			maxLength: [
				128,
				"Please make sure your password is less than 128 characters long",
			],
		},
		bookmarks: {
			type: [ObjectId],
			ref: "StoryModel",
		},
	},
	{
		collection: "users", // Set the collection name here
		timestamps: true, // Enable timestamps for createdAt and updatedAt
	}
);

// Hash password before saving the user
userSchema.pre("save", async function (next) {
	try {
		if (this.isNew) {
			const salt = await bcrypt.genSalt(12);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
		}
		next();
	} catch (error) {
		next(error);
	}
});

const UserModel =
	mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

module.exports = UserModel;
