const mongoose = require("mongoose");
const { Schema } = mongoose;

const receiverSchema = Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    }, 
    blood_grp : String,
    quantity : Number,
    date : String,
});

module.exports.Receive = mongoose.model("Receive", receiverSchema);
