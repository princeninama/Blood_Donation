const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Blood } = require("../schemas/blood");

const bbankSchema = Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
    },
    blood : {
        type : Object,
    }
});

module.exports.bbank = mongoose.model("BBank", bbankSchema);
