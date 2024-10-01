// const RegisterUser = require("../Services/authService");
// const loginUser = require("../Services/authService");
const { RegisterUser, loginUser } = require("../Services/authService");
const { generateToken } = require("../Services/tokenService");
const verifyToken = require("../Services/tokenService");

const accessTokenExpiry = "1d";

//register user
const register = async (req, res, next) => {
	try {
		const { name, password } = req.body;
		const newUser = await RegisterUser({ name, password });

		const accessToken = await generateToken(
			{ userId: newUser._id },
			accessTokenExpiry,
			process.env.SECRET_KEY
		);
		res.json({
			message: "User registered successfully",
			user: {
				_id: newUser._id,
				name: newUser.name,
				bookmarks: newUser.bookmarks,
				token: accessToken,
			},
		});
	} catch (err) {
		next(err);
	}
};

//login user
const login = async (req, res, next) => {
	try {
		const { name, password } = req.body;
		const user = await loginUser(name, password);
		const accessToken = await generateToken(
			{ userId: user._id },
			accessTokenExpiry,
			process.env.SECRET_KEY
		);

		res.json({
			message: "User logged in successfully",
			user: {
				_id: user._id,
				name: user.name,
				bookmarks: user.bookmarks,
				token: accessToken,
			},
		});
	} catch (err) {
		next(err);
	}
};

//logout user
const logout = async (req, res, next) => {
	try {
		res.json({
			message: "User logged out successfully",
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	register,
	login,
	logout,
};
