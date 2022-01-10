const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const _ = require('lodash');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })


module.exports.find =  async(req,res,next)=>{
const page = 1 ;
const limit= 15;
const filter = [
{title:{$regex:req.body.q}},
{location:{$regex:req.body.q}},
{description:{$regex:req.body.q}}
];
 const campgrounds = await Campground.find({$or: filter}).limit(limit).skip((page-1)*limit).populate("author");
 const allCamp = campgrounds;
 var count = 0;
  if(allCamp.length >15 && !allCamp.length % 15 === 0){
    count ++;
    }
for (let i = 0; i <  campgrounds.length; i+=15) {
   count ++
   }
  res.render("index",{campgrounds ,count ,allCamp , page})
}

module.exports.index = async (req, res, next) => {
   const {page = 1 , limit= 15} = req.query;
    const allCamp = await Campground.find({});
    const campgrounds = await Campground.find({}).sort({createdAt:"descending"}).limit(limit).skip((page-1)*limit).populate("author");
    var count = 0;
  if(allCamp.length >15 && !allCamp.length % 15 === 0){
    count ++;
    }
for (let i = 0; i <  allCamp.length; i+=15) {
   count ++
   }
    res.render('index', { campgrounds , count ,page , allCamp})
}

module.exports.renderNewForm = (req, res,next) => {
     res.render('new')
}
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
    }).send()
   if(geoData.body.features.length === 0){
        for (let file of req.files) {
            await cloudinary.uploader.destroy(file.filename)
        }
req.flash("error", "Place not Exist")
    res.redirect(`/campgrounds/new`)
    }
 const newground = new Campground(req.body.campground)
    newground.geometry = geoData.body.features[0].geometry;
if(req.files){
console.log(req.files)
 newground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
}
    newground.author = req.user._id
    await newground.save()
    req.flash("success", "Successfully created Camp")
    res.redirect(`/campgrounds/${newground._id}`)
}
module.exports.renderUpdateForm = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('edit', { campground })
}
module.exports.campgroundUpdate = async (req, res, next) => {
    const { id } = req.params
   const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
    }).send()
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground , $currentDate: { updatedAt: true } }, { new: true, runValidators: true});
    campground.geometry = geoData.body.features[0].geometry;
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.image.push(...img);
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } }, { new: true })
    }
    campground.save()
    req.flash("success", "Successfully updated Camp")
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground = async (req, res, next) => {
    const campground = await Campground.findByIdAndDelete(req.params.id)
    req.flash("error", "Successfully deleted Camp")
    res.redirect("/campgrounds")
}
module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "review",
        populate: {
            path: "author"
        }
    }).populate("author")
    res.render("show", { campground})
}