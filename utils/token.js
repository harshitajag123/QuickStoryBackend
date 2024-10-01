const jwt = require("jsonwebtoken");
const loggs = require("../ConfigFile/loggerConfig");

//generating the token

const sign = async (payload, expiresIn, secret) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, secret, { expiresIn: expiresIn }, (err, token) => {
			if (err) {
				loggs.error(err);
				reject(err);
			} else {
				resolve(token);
			}
		});
	});
};

const verifyUser = async (token, secret) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, payload) => {
			if (err) {
				loggs.error(err);
				reject(err);
			} else {
				resolve(payload);
			}
		});
	});
};

module.exports = {
	sign,
	verifyUser,
};
//here we using promise because in jwt are not async so we cant use aync await
