const { logger } = require("../middleware/errorHandler");

const validate = (schema) => (req, res, next) => {
  try {
    const validData = schema.parse(req.body);
    req.body = validData;
    next();
  } catch (err) {
    res.status(403).json({ errors: err.message });
    logger.error(err.message);
  }
};

module.exports = validate;
