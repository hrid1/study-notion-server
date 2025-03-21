const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
