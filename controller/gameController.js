const Game = require("../models/game");
const Review = require("../models/review");

exports.getGames = async (req, res) => {
  const games = await Game.find();
  res.status(200).json({ games });
};

exports.getGame = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findById(id);
  if (!game) return res.status(404).json({ message: "Game not found" });
  res.status(200).json(game);
};

exports.getGameRatings = async (req, res) => {
  const { id } = req.params;

  const game = await Game.findById(id).populate({
    path: "reviews",
    select: "content rating -_id",
    populate: {
      path: "author",
      select: "name -_id",
    },
  });
  if (!game) return res.status(404).json({ message: "Game not found" });

  res.status(200).json({ game });
};

exports.createGame = async (req, res) => {
  const game = await Game.create(req.body);
  res.status(201).json({ status: "Success", message: "Game created", game });
};

exports.updateGame = async (req, res) => {
  const { id } = req.params;

  const game = await Game.findById(id);
  if (!game) return res.sendStatus(404);

  Object.assign(game, req.body);
  await game.save();

  res.status(204).json({
    status: "Successful",
    message: "Game Updated",
    game,
  });
};

exports.deleteGame = async (req, res) => {
  const { id } = req.params;
  const deletedGame = await Game.findByIdAndDelete(id);
  if (!deletedGame) return res.sendStatus(404);

  res.status(204).json({
    status: "Succesful",
    message: "Game deleted",
    deletedGame,
  });
};
