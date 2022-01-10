const express = require('express');
const passport = require('passport');
const user = require('../controllers/user');

const router = express.Router()

router.route("/register")
    .get(user.renderRegisterForm)
    .post(user.register);

router.route("/user/:id")
    .get(user.renderUser)

router.route("/login")
    .get(user.renderLoginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), user.login)

router.get("/logout", user.logout)


module.exports = router