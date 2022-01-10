const express = require('express');
const router = express.Router()
const wrapAsync = require("../utils/catchError");
const Campground = require('../controllers/campground');
const multer = require('multer')
const { storage } = require("../cloudinary/index")
const upload = multer({ storage })
const { isLoggedIn, isValidId, isAuthorize, validatecamp, campExist } = require("../utils/middleware");

router.get('/', wrapAsync(Campground.index));

router.post("/find",wrapAsync(Campground.find));

router.get('/new', isLoggedIn, Campground.renderNewForm);

router.post('/', isLoggedIn,  upload.array("image"),validatecamp, wrapAsync(Campground.createCampground));

// router.post('/', upload.array("image"), (req, res) => {
//     console.log(req.body, req.files)
// });

router.get('/edit/:id', isValidId, campExist, isLoggedIn, isAuthorize, wrapAsync(Campground.renderUpdateForm));

router.post("/edited/:id", isValidId, campExist, isLoggedIn, isAuthorize, upload.array("image"), validatecamp, wrapAsync(Campground.campgroundUpdate));

router.post("/delete/:id", isValidId, campExist, isLoggedIn, isAuthorize, wrapAsync(Campground.deleteCampground));

router.get('/:id', isValidId, campExist, wrapAsync(Campground.showCampground));

module.exports = router;