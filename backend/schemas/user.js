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
    profession: {
        type: String,
        required: true,
        enum: ["USER", "BBANK"],
    },
    otp: {
        type: String,
        required: false,
    },
    state : {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: Boolean,
});

// plugin local passport strategy in user Schema
userSchema.plugin(passportLocalMongoose);

module.exports.User = mongoose.model("User", userSchema);
module.exports.Student = mongoose.model("Student", studentSchema);
module.exports.Faculty = mongoose.model("Faculty", facultySchema);
