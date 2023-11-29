const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const multer = require('multer')
//const { campgroundSchema } = require('../schemas.js');
const { storage } = require('../cloudinary');

const ExpressError = require('../Utils/ExpressError');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor } = require('../middleware');
const { populate } = require('../models/review');
const campground = require('../models/campground');


const upload = multer({ storage });



router.get('/', catchAsync(async (req, res) => {

    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })
}))
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')

});

router.post('/', isLoggedIn, upload.array('image'), catchAsync(async (req, res, next) => {


    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully created campground');
    res.redirect('/campgrounds')
}))


// router.post('/', upload.array('image'), isLoggedIn, catchAsync(async (req, res, next) => {


//     console.log(req.files)
//     res.send("it worked")
// }))

router.patch('/:id', isLoggedIn, isAuthor, upload.array('image'), catchAsync(async (req, res) => {
    const { id } = req.params;

    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.images.push(...imgs);

    camp.save();

    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${camp._id}`);
}))


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id)

    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds')

}))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    console.log(camp.description);
    res.render('campgrounds/edit', { camp })


}))


router.get('/:id', catchAsync(async (req, res) => {

    const { id } = req.params;

    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');


    // const camp = await Campground.findById(id).populate('reviews').populate('author');
    //console.log(camp);


    res.render('campgrounds/show', { camp })
}))

module.exports = router;