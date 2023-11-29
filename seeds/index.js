
const Campground = require('../models/campground')

const mongoose = require('mongoose')

const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
mongoose.connect("mongodb://localhost:27017/yelp-camp")

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {

    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {

        const randl = Math.floor(Math.random() * 1000);
        const pricerand = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64efdb355f31980c92da65fd',//this pasted from db which exists
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randl].city}, ${cities[randl].state}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima reiciendis totam dignissimos odio a porro voluptatum, minus error voluptatibus aliquam quibusdam dolores qui sapiente, sunt dolor vero nam quisquam eaque",
            price: pricerand,
            images: [
                {
                    url: 'https://res.cloudinary.com/dkwrgudzt/image/upload/v1694283927/Yelp/ptk4zixvuyarhaldq4fm.jpg',
                    filename: 'Yelp/ptk4zixvuyarhaldq4fm',

                },
                {
                    url: 'https://res.cloudinary.com/dkwrgudzt/image/upload/v1694283927/Yelp/hddb34bnzvqbipycsawi.jpg',
                    filename: 'Yelp/hddb34bnzvqbipycsawi',

                },
                {
                    url: 'https://res.cloudinary.com/dkwrgudzt/image/upload/v1694283927/Yelp/s0bnvhqty625ox8kfkiu.jpg',
                    filename: 'Yelp/s0bnvhqty625ox8kfkiu',

                }
            ]

        });
        await camp.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})