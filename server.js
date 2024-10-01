const mongoose = require("mongoose");
const app = require("./app.js");
const loggs = require("./ConfigFile/loggerConfig.js");

//env variables
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

// -----------------mongodb setup-------------------------------------

// event listener for events emitted by the mongoose.connection : exit on mongodb error
mongoose.connection.on("error", (error) => {
	loggs.error(`MONGOdb Connection error: ${error}`);
	process.exit(1);
});

//mongodb debug mode : to show any operation happens on mongodb only for development only
if (process.env.NODE_ENV != "production") {
	mongoose.set("debug", true);
}

//mongodb connection
mongoose
	.connect(DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		loggs.info("connected to MONGODB.");
	});

// -------------listen to server -------------------------

let server = app.listen(PORT, () => {
	loggs.info(`server is listening at ${PORT}`);
});

//----------handle server errors----------------------
const exitHandler = () => {
	if (server) {
		loggs.info("server closed");
		process.exit(1);
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	loggs.error(error);
	exitHandler(); // to exit the server
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// SIGTERM is a termination signa In UNIX to terminate our process gracefully.
process.on("SIGTERM", () => {
	if (server) {
		loggs.info("server closed");
		process.exit(1);
	}
});

//webStory  webstory
