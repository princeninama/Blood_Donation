const mongoose = require("mongoose");
const { Schema } = mongoose;

const donorSchema = Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    blood_grp : String,
    quantity : Number,
    date : String,
    accept : Boolean
});

module.exports.Donor = mongoose.model("Donor", donorSchema);
