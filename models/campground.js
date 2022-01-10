const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary/index');
// https://res.cloudinary.com/dtzz4ntnc/image/upload/v1639060933/Yelpcamp/dzq4ayljfdbdir7entwv.jpg
const imageSchema = new Schema({
    url: {
          type:String,
          default:"https://res.cloudinary.com/dtzz4ntnc/image/upload/v1639245116/Yelpcamp/hrcsepfkldgi8ohf9twh.jpg"
     },
    filename: {
         type:String,
         default:"Yelpcamp/hrcsepfkldgi8ohf9twh"
     }
})
imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200")
})

const opts = {toJSON:{virtuals:true},timestamps: true};

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    image: [imageSchema],
    location: {
        type: String,
        required: true
    },
    description: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    review: [{ type: Schema.Types.ObjectId, ref: "Review" }]

},opts);

CampgroundSchema.virtual("properties.popup").get(function(){
   return `<h6><a style="text-decoration: none" href="/campgrounds/${this._id}">${this.title}</a></h6><p>${this.description.substring(0,50)}...</p>`
})

CampgroundSchema.post("findOneAndDelete", async (camp) => {
    if (camp) {
        await Review.deleteMany({ _id: { $in: camp.review } })
        for (let file of camp.image) {
            await cloudinary.uploader.destroy(file.filename)
        }
    }
})
CampgroundSchema.methods.calculateAvgRating = function () {
    let ratingsTotal = 0;
    if (this.review.length) {
        this.review.forEach(review => {
            ratingsTotal += review.rating;
        });
        this.avgRating = Math.round((ratingsTotal / this.review.length) * 10) / 10;
    } else {
        this.avgRating = ratingsTotal;
    }
    const floorRating = this.avgRating;
    return floorRating;
}
module.exports = mongoose.model('Campground', CampgroundSchema);