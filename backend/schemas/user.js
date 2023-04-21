const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: false,
    },
    state : {
        type: String,
        required: true,
    },
    isAdmin : Boolean,
    isActive: Boolean,
    isFilled: Boolean,
});

// plugin local passport strategy in user Schema
userSchema.plugin(passportLocalMongoose);

module.exports.User = mongoose.model("User", userSchema);
