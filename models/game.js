const mongoose = require("mongoose");
const Review = require('./review')

const gameSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    platforms: {
      type: [String],
      enum: ['PS5', 'MOBILE', 'XBOX', 'SWITCH','PC' ],
      required: true
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gameSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "game",
});

gameSchema.pre('findByIdAndDelete', async function(next){
    const gameId = this.getQuery()._id;
    await Review.deleMany({game: gameId})
    next()

})

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
