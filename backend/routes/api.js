const router = require("express").Router();
const { checkAuthentication } = require("../middleware/authentication");
const { Donor } = require("../schemas/donor");
const { Receive } = require("../schemas/receiver");
const { MainUser } = require("../schemas/user");

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
    });
});

router.post("userdetail" ,checkAuthentication , (req , res) => {
    const {name,addres,blood_grp,dob} = req.body;
    const username = req.user.username;
    const newUser = new MainUser({
        username : username,
        name : name,
        addres : addres,
        blood_grp : blood_grp,
        dob : dob,
    });
    newUser.save().then(() => {
        res.send("User Detail done");
    }).catch((err) => {
        console.log(err);
        res.send("error in userdetail");
    })
});

router.post("getuser" , checkAuthentication , (req , res) => {
    let user = req.user;
    MainUser.findOne({username : user.username} , (err , mainuser) => {
        if(err){
            console.log(err);
            res.send("User Not Found");
        }
        res.json({user : user , mainuser : mainuser})
    })
});

module.exports = router;