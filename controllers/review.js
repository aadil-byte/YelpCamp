const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.review.push(review);
    await review.save()
    await campground.save()
    req.flash("success", "Successfully created review")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewid } = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewid } })
    req.flash("success", "Successfully deleted review")
    res.redirect(`/campgrounds/${id}`)
}