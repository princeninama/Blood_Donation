const express = require("express");
const app = express();
const donor = require("./schemas/donor");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/donate",function(req,res){
    const donate= new donor({
        username : req.body.username,
        blood_grp : req.body.blood_group,
        quantity : req.body.quentity,
        date : req.body.date,
        accept : false
    });
    

});