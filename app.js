const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const createHttpError = require("http-errors");
const routes = require("./Routes/root");
const authRoutes = require("./Routes/authRoutes");
const storyRoutes = require("./Routes/storyRoutes");
const userRoutes = require("./Routes/userRoutes");

// dotenv configuration
dotenv.config();

const allowedOrigins = [
	"http://localhost:5173",
	"https://web-story-three.vercel.app",
];
const corsOptions = {
	origin: function (origin, callback) {
		// Check if the origin is in the list of allowed origins
		// When a request is made from a page to the same origin , browsers typically do not include an Origin header.
		// This behavior is part of the browser's same-origin policy to allow same origin requests and Non-CORS Requests.
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true); // Allow the request
		} else {
			callback(new Error("Not allowed by CORS")); // Block the request
		}
	},
	optionsSuccessStatus: 200, // For legacy browser support
};

const app = express();

//morgan
if (process.env.NODE_ENV != "production") {
	app.use(morgan("dev"));
}
//helmet
app.use(helmet());

//parse josn request url
app.use(express.urlencoded({ extended: true }));

//parse json request body
app.use(express.json());

//express mongo sanitize user data
app.use(mongoSanitize());

//gzip compression
app.use(compression());

//cors
app.use(cors(corsOptions));

//---------------------------------routes---------------------------------
//api v1 routes
app.use("/api/v1", routes);

// API routes
app.use("/api/v1/auth", authRoutes); // Auth routes
app.use("/api/v1/stories", storyRoutes); // Story routes
app.use("/api/v1/users", userRoutes); // User routes

app.get("/test", (req, res) => {
	res.send(`<div>this is  a test route</div>`);
});

app.get("*", (req, res) => {
	res.status(404).send("Page not found");
});

// -----------------Error handling-------------------------------

// this is our error-handling middleware : It's a centralized place to handle application errors
// here using async is not necessary, but using async might be helpful in future if we wnat to logging to DB.
app.use(async (err, req, res, next) => {
	res.status(err.status || 500);
	res.send({
		error: {
			status: err.status || 500,
			message: `${err.message}`,
		},
	});
});

module.exports = app;
