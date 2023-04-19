const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Blood } = require("../schemas/blood");

const bbankSchema = Schema({
    name : {
        type : String,
        required : true,
        unique : true,
    },
    blood : Blood,
});

module.exports.bbank = mongoose.model("BBank", bbankSchema);
