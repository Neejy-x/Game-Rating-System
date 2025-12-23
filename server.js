require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
require("./middleware/db");
const { notFoundHandler } = require("./middleware/404Handler");
const { errorHandler, logger } = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const authors = require("./routes/authors");
const reviews = require("./routes/reviews");
const games = require("./routes/games");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/reviews", reviews);
app.use("/profile", authors);
app.use("/games", games);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => logger.info(`Listening on PORT ${PORT}...`));
