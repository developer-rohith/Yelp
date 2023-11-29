if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}



const express = require('express');
const app = express();
const path = require('path');
// const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')
const ExpressError = require('./Utils/ExpressError')
// const catchAsync = require('./Utils/catchAsync')
// const Review = require('./models/review')
app.use(express.urlencoded({ extended: true }))
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



const session = require('express-session');


const sessionConfig = {
    secret: 'notabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }

}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const mongoose = require('mongoose')
app.engine('ejs', ejsMate)
mongoose.connect("mongodb://localhost:27017/yelp-camp")

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
})
const methodOverride = require("method-override")

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/', usersRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);


app.get('/', (req, res) => {

    res.render("home")
})

// app.get('/campgrounds', catchAsync(async (req, res) => {

//     const camps = await Campground.find({});
//     res.render('campgrounds/index', { camps })
// }))
// app.get('/campgrounds/new', (req, res) => {
//     res.render('campgrounds/new')

// });

// app.post('/campgrounds', catchAsync(async (req, res, next) => {


//     const camp = new Campground(req.body.campground);
//     await camp.save();
//     res.redirect('/campgrounds')
// }))

// app.patch('/campgrounds/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true })
//         .then(data => {
//             console.log(data)
//             res.redirect(`/campgrounds/${data._id}`);

//         })
//         .catch(err => {
//             console.log("ohhhh ", err);
//         });
// }))


// app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const camp = await Campground.findByIdAndDelete(id)
//     console.log(camp);
//     res.redirect('/campgrounds')

// }))



// app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const camp = await Campground.findById(id);
//     console.log(camp.description);
//     res.render('campgrounds/edit', { camp })


// }))

// app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);

//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// }))




// app.get('/campgrounds/:id', catchAsync(async (req, res) => {

//     const { id } = req.params;

//     const camp = await Campground.findById(id).populate('reviews');

//     res.render('campgrounds/show', { camp })
// }))

// app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;

//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${id}`)
// }))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})



app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('errors', { err });
})



app.listen(3000, () => {
    console.log("listening 3000");
});