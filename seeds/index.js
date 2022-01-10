const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50);
        const camp = new Campground({
            author: "61ab67e46495e77b2d9470bc",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/dtzz4ntnc/image/upload/v1641382678/Yelpcamp/t9yp9arcfqaqtdnykhlr.jpg',
                    filename: 'Yelpcamp/t9yp9arcfqaqtdnykhlr'
                },
                {
                    url: 'https://res.cloudinary.com/dtzz4ntnc/image/upload/v1641382681/Yelpcamp/mbupqpotmokiwpjto2hx.jpg',
                    filename: 'Yelpcamp/mbupqpotmokiwpjto2hx'
                },
                {
                    url: 'https://res.cloudinary.com/dtzz4ntnc/image/upload/v1641382677/Yelpcamp/gq6xc5jaki12npnpx9sy.jpg',
                    filename: 'Yelpcamp/gq6xc5jaki12npnpx9sy'
                },
                {
                    url:'https://res.cloudinary.com/dtzz4ntnc/image/upload/v1641382683/Yelpcamp/lu4nah2ovck8j5grhb2l.jpg',
                    filename: 'Yelpcamp/lu4nah2ovck8j5grhb2l'
                }
            ],
            geometry : { type : "Point", coordinates : [cities[random1000].longitude ,cities[random1000].latitude ] },
            price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto provident veritatis quam? Perferendis illo facilis tempore totam dolor, porro suscipit, minima consequuntur dolore, ab commodi! Blanditiis ex nihil maiores reiciendis!"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})