const express = require("express");
const router = express.Router();
const validate = require("../middleware/validator");
const { signupSchema, loginSchema } = require("../validation/authValidations");

const {
  signupHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
} = require("../controller/authControllers");

router.post("/login", validate(loginSchema), loginHandler);
router.post("/logout", logoutHandler);
router.post("/signup", validate(signupSchema), signupHandler);
router.post('/refresh', refreshHandler)

module.exports = router;
