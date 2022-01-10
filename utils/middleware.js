const Apperror = require("./error")
const ObjectID = require('mongoose').Types.ObjectId;
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campSchema, reviewSchema } = require("../models/schema")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "Please Sign In First")
        return res.redirect("/login")
    } else {
        next()
    }
}
module.exports.isValidId = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id || req.query.id)) {
        throw new Apperror('Invalid user id', 400);
    } else {
        next()
    }
}
module.exports.isAuthorize = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash("error", "You are not allowed to perform this action")
        res.redirect(`/campgrounds/${id}`)
    } else {
        next()
    }
}
module.exports.isAuthorizeRev = async (req, res, next) => {
    const { reviewid, id } = req.params;
    const Rev = await Review.findById(reviewid);
    if (!Rev.author.equals(req.user._id)) {
        req.flash("error", "You are not allowed to perform this action")
        res.redirect(`/campgrounds/${id}`)
    } else {
        next()
    }
}
module.exports.validatecamp = (req, res, next) => {
    const { error } = campSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(e => e.message).join(",")
        throw new Apperror(msg, 400)
    } else {
        next()
    }
}
module.exports.validaterev = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(e => e.message).join(",")
        throw new Apperror(msg, 400)
    } else {
        next()
    }
}
module.exports.campExist = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Campground not exist");
        res.redirect("/campgrounds")
    } else {
        next()
    }
}