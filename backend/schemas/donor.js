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
});

module.exports.donor = mongoose.model("Donor", donorSchema);
