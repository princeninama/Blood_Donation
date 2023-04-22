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

const mainuserSchema = Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    name : {
        type : String,
        required : true,
    },
    addres : {
        type : String,
        required : true,
    },
    blood_grp : {
        type : String,
        required : true,
    },
    dob : {
        type : String,
        required : true,
    }

});

// plugin local passport strategy in user Schema
userSchema.plugin(passportLocalMongoose);

module.exports.User = mongoose.model("User", userSchema);
module.exports.MainUser = mongoose.model("MainUser" , mainuserSchema);