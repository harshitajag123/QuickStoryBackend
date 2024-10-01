//const sign = require("../utils/token");
const { verifyUser, sign } = require("../utils/token");

const generateToken = async (payload, expiresIn, secret) => {
	let token = await sign(payload, expiresIn, secret);
	return token;
};

const verifyToken = async (token, secret) => {
	let payload = await verifyUser(token, secret);
	return payload;
};

module.exports = {
	generateToken,
	verifyToken,
};
