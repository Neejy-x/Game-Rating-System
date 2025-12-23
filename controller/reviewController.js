const Review = require("../models/review");
const _ = require('lodash')

exports.getReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id).populate([
    {
      path: "author",
      select: "name email -_id",
    },
    {
      path: "game",
      select: "title -_id",
    },
  ]);

  if (!review) return res.sendStatus(404);

  res.status(200).json({
    status: "Success",
    review,
  });
};

exports.createReview = async (req, res) => {
    const reviewBody = _.pick(req.body, ['content', 'rating', 'game'])
  const review = await Review.create({...reviewBody, author: req.user.id});
  if (!review) return res.sendStatus(400);

  res.status(200).json({
    status: "Success",
    review,
  });
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) return res.sendStatus(404);
  if(review.author.equals(req.user.id)) return res.sendStatus(403);
  const reviewBody = _.pick(req.body, ["content", "rating"])
  Object.assign(review, reviewBody);
    await review.save()
  res.status(200).json({
    status: "Successful",
    review,
  });
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) return res.sendStatus(404);
    if(!review.author.equals(req.user.id)) return res.sendStatus(403)
    await review.deleteOne()
  res.status(204).json({
    status: "Successful",
    deletedReview,
  });
};
