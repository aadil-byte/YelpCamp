if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
const express = require('express');
const dbUrl = process.env.DB_URL;
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('connect-flash');
const Apperror = require("./utils/error")
const campgroundroute = require('./routes/campground');
const reviewroute = require('./routes/review');
const userRoute = require('./routes/user');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require("passport-local")
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const {contentAllowed} = require('./utils/helmet');
const MongoStore = require('connect-mongo');

mongoose.connect(dbUrl)
    .then(() => {
        console.log("connected")
    })
    .catch(err => {
        console.log("ERROR")
        console.log(err)
    })
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize({
    replaceWith: '_',
  }));
app.use(flash());
app.use(helmet());
app.use(contentAllowed)
const secret = process.env.SECRET ||  'iamemotional';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret,
    }
});
store.on("error", function(e) {
    console.log("Session Error", e);
});
 
app.use(session({
    store,
    name:"Session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000*60*60*24*30,
        maxAge :  1000*60*60*24*30
    }
}));
// passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
        res.locals.currentUser = req.user,
        res.locals.success = req.flash("success"),
        res.locals.error = req.flash("error"),
        next()
})

app.get('/', (req, res) => {
    res.render('home')
});
app.use("/", userRoute);
app.use("/campgrounds", campgroundroute);
app.use("/campground/:id/review", reviewroute);


app.all("*", (req, res, next) => {
    next(new Apperror("Page Not Found", 404))
})
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = "Something went Wrong" }
    res.status(status).render("error", { err })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
