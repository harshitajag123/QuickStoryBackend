//before passing our request to controller , we check whether the request have valid token or not.

const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
	if (!req.headers["authorization"]) {
		return next(createHttpError.Unauthorized());
	}

	const bearerToken = req.headers["authorization"];
	const token = bearerToken.split(" ")[1];

	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) {
			return next(createHttpError.Unauthorized());
		}

		//adding metadata to req header
		req.user = decoded.userId;
		next();
	});
};

module.exports = authMiddleware;
