const mongoose = require("mongoose");
const { Schema } = mongoose;

const bloodSchema = Schema({
    Ap : Number,
    An : Number,
    Bp : Number,
    Bn : Number,
    ABp : Number,
    ABn : Number,
    Op : Number,
    On : Number,
    total : Number,
});

module.exports.blood = mongoose.model("Blood", bloodSchema);
