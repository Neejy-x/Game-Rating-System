const { logger } = require("./errorHandler");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("Connected to DB...");
  })
  .catch((err) => logger.error("Error connecting to Databse", err));
