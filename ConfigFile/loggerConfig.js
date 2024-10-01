/* 
  Just to add the logging info in a proper way depending on the Node environemnt whether development  or production.
*/
const winston = require("winston");
//import winston from "winston";

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const loggs = winston.createLogger({
	level: process.env.NODE_ENV === "development" ? "debug" : "info",
	format: winston.format.combine(
		enumerateErrorFormat(),
		process.env.NODE_ENV === "development"
			? winston.format.colorize()
			: winston.format.uncolorize(),
		winston.format.splat(),
		winston.format.printf(({ level, message }) => `${level}: ${message}`)
	),
	transports: [
		new winston.transports.Console({
			stderrLevels: ["error"],
		}),
	],
});

module.exports = loggs;
//export default loggs;

// To be used as logger.info(message) or logger.error(error)
