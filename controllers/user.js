const User = require('../models/user');
const Campground = require('../models/campground');

module.exports.renderRegisterForm = (req, res) => {
    res.render("user/register")
}
module.exports.register = async (req, res,next) => {
    try {
        const { password, username, email } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Successfully Registered");
            res.redirect("/campgrounds")
        })
    } catch (e) {
        req.flash("error", `${e.message}`);
        res.redirect("/register")
    }
}
module.exports.renderUser = async (req,res,next)=>{
     const {page = 1 , limit= 15} = req.query;
     const allCamp = await Campground.find({author:req.params.id});
    const campgrounds = await Campground.find({author:req.params.id}).sort({updatedAt:"descending"}).limit(limit).skip((page-1)*limit).populate("author");
    var count = 0;
     if(allCamp.length >15 && !allCamp.length % 15 === 0){
    count ++;
    }
for (let i = 0; i <  allCamp.length; i+=15) {
   count ++
   }
    res.render('user', { campgrounds , count ,page,allCamp })
}
module.exports.renderLoginForm = (req, res) => {
    res.render("user/login")
}
module.exports.login = async (req, res,next) => {
    req.flash("success", "Welcome back, Logged In")
    const redirect = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo
    res.redirect(redirect)
}
module.exports.logout = (req, res,next) => {
    req.logout();
    req.flash("success", "Goodbye,Successfully logout");
    res.redirect("/campgrounds")
}