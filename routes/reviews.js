const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authHandler");
const validate = require('../middleware/validator')
const {
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");
const {
  createReviewSchema,
  updateReviewSchema,
} = require("../validation/reviewValidations");

router.use(auth);

router
  .route("/:id")
  .get(getReview)
  .patch(validate(updateReviewSchema), updateReview)
  .delete(deleteReview);
router.post("/", validate(createReviewSchema), createReview);


module.exports = router;
