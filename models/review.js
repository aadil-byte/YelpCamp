const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = ({
    comment: {
        type: String,
        require: [true, "Comment is necessary"]
    },
    rating: {
        type: Number,
        require: [true, "rating is required"]
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review;