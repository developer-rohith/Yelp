const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Review = require('./review')
const CampgroundSchema = Schema({
    title: String,
    price: Number,
    description: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {

    console.log("deleting")
    if (doc) {
        //await Review.remove({ _id: { $in: doc.reviews } })
        await Review.deleteMany({ _id: { $in: doc.reviews } })




        //await Review.remove({ _id: { $in: doc.reviews } })

    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);