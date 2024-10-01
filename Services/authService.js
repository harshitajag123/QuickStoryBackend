const createHttpError = require("http-errors");
const validator = require("validator");
const UserModel = require("../Models/user");
const bcrypt = require("bcrypt");

//register user -- checking validations for name and password and creating user
const RegisterUser = async (userData) => {
	const { name, password } = userData;

	//---checking validations
	//check all fields are provided
	if (!name || !password) {
		throw createHttpError.BadRequest("Please provide name and password");
	}

	//check if name is valid
	if (!validator.isLength(name, { min: 3, max: 15 })) {
		throw createHttpError.BadRequest(
			"Name must be between 3 to 15 characters..."
		);
	}

	//check if user exists already
	const checkIfUserExists = await UserModel.findOne({ name });
	if (checkIfUserExists) {
		throw createHttpError.BadRequest("User already exists");
	}

	//check password length and hashing is done in usermodel file
	if (!validator.isLength(password, { min: 5, max: 128 })) {
		throw createHttpError.BadRequest(
			"please make sure your password is between 5 and 128 characters.."
		);
	}

	//---creating user
	const user = await new UserModel({ name, password }).save();

	return user;
};

//login user -- checking validations and password matches
const loginUser = async (name, password) => {
	const user = await UserModel.findOne({ name });
	if (!user) {
		throw createHttpError.Unauthorized("User does not exist");
	}

	//compare passwords
	let passwordMatches = await bcrypt.compare(password, user.password);

	if (!passwordMatches) throw createHttpError.NotFound("Invalid password");

	return user;
};

module.exports = {
	RegisterUser,
	loginUser,
};
