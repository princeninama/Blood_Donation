const router = require("express").Router();
const { checkAuthentication } = require("../middleware/authentication");
const { Donor } = require("../schemas/donor");
const { Receive } = require("../schemas/receiver");


router.post("/donate", checkAuthentication ,function(req,res){
    const user = req.user;
    const donate = new Donor({
        username : user.username,
        blood_grp : req.body.blood_group,
        quantity : req.body.quentity,
        date : req.body.date,
        accept : false
    });
    donate.save().then(() => {
                res.send("donotaion accepted");
            }).catch((err) => {
                console.log(err);
            });

});

router.post("/receive", checkAuthentication ,function(req,res){
    const user = req.user;
    const receive = new Receive({
        username : user.username,
        blood_grp : req.body.blood_group,
        quantity : req.body.quentity,
        date : req.body.date,
        accept : false
    });
    receive.save().then(() => {
        res.send("receive requested");
    }).catch((err) => {
        console.log(err);
    });;
});

module.exports = router;

