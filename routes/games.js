const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/authHandler");
const validate = require("../middleware/validator");
const {
  createGameSchema,
  updateGameSchema,
} = require("../validation/gameValidation");
const {
  getGames,
  getGame,
  getGameRatings,
  createGame,
  updateGame,
  deleteGame,
} = require("../controller/gameController");

router.use(auth);

router
  .route("/")
  .get(getGames)
  .post(isAdmin, validate(createGameSchema), createGame);

router
  .route("/:id")
  .get(getGame)
  .patch(isAdmin, validate(updateGameSchema), updateGame)
  .delete(isAdmin, deleteGame);

router.get("/:id/reviews", getGameRatings);

module.exports = router;
