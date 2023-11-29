const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../Utils/catchAsync');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
//const { campgroundSchema } = require('../schemas.js');

const ExpressError = require('../Utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review')


router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created review');
    res.redirect(`/campgrounds/${campground._id}`);
}))



router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router;