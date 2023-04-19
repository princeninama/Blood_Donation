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
    image: {
        type: String,
        required: false,
    },
    b_group : {
        type : String,
        required : true,
    },
    otp: {
        type: String,
        required: false,
    },
    state : {
        type: String,
        required: true,
    },
    isActive: Boolean,
});

const blood_bankSchema = Schema({
    name : {
        type : String,
        required : true,
        unique : true,
    },
    email :{
        type : String,
        required : true,
    },
    contact : {
        type : Number,
        required : true,
    },
    state : {
        type : String,
        required : true,
    },
    addres : {
        type : String,
        required : true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        required: false,
    },
});

// plugin local passport strategy in user Schema
userSchema.plugin(passportLocalMongoose);

module.exports.User = mongoose.model("User", userSchema);
module.exports.BloodBank = mongoose.model("BloodBank", blood_bankSchema);
