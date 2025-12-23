const winston = require("winston");

const { combine, timestamp, json, prettyPrint, colorize } = winston.format;

const logger = winston.createLogger({
  level: "debug",
  format: combine(json(), timestamp(), prettyPrint()),

  transports: [
    new winston.transports.File({ filename: "logs.log", level: "info" }),
    new winston.transports.Console(),
  ],

  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
    new winston.transports.Console({
      format: combine(colorize(), winston.format.simple()),
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log" }),
    new winston.transports.Console({ format: combine(prettyPrint()) }),
  ],
});

const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Author already exists",
    });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({ errors: err.format() });
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`${err.name}: ${message}`, { stack: err.stack });

  res.status(statusCode).json({
    status: "error",
    message: message,
});
}
module.exports = { logger, errorHandler };
