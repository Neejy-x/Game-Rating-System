const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid Game ID",
  });

const createReviewSchema = z.object({
  content: z.string(),
  rating: z.number().int().min(1).max(10),
  game: objectId,
});

const updateReviewSchema = createReviewSchema.partial();

module.exports = { createReviewSchema, updateReviewSchema };
