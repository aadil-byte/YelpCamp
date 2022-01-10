const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    }
})

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.email) {
        next(new Error('Email address was already taken, please choose a different one'));
    } else {
        next(error);
    }
});

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", userSchema)