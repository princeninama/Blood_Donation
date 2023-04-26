const router = require("express").Router();
const { checkAuthentication } = require("../middleware/authentication");
const { Donor } = require("../schemas/donor");
const { Receive } = require("../schemas/receiver");
const { MainUser, User } = require("../schemas/user");
const { route } = require("./api");
const { bbank } = require("../schemas/blood_bank");

router.post("/donate", checkAuthentication ,function(req,res){
    const user = req.user;
    const {bloodbank , blood_grp} = req.body
    const donate = new Donor({
        username : user.username,
        blood_grp : blood_grp,
        quantity : Number(req.body.quantity),
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

router.post("/userdetail" ,checkAuthentication , (req , res) => {
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

router.post("/getuser" , checkAuthentication , (req , res) => {
    const user = req.user;
    MainUser.findOne({username : user.username} , (err , mainuser) => {
        if(err){
            console.log(err);
            res.send("User Not Found");
        }
        res.json({user : user , mainuser : mainuser})
    })
});


router.post("/bankdetail" ,checkAuthentication , (req , res) => {
    const {name,Ap,An,Bp,Bn,ABp,ABn,Op,On} = req.body;
    const username = req.user.username;
    const newUser = new bbank({
        username : username,
        name : name,
        blood : {
            Ap : Number(Ap),
            An : Number(An),
            Bp : Number(Bp),
            Bn : Number(Bn),
            ABp : Number(ABp),
            ABn : Number(ABn),
            Op : Number(On),
            On : Number(On),
            total : Number(Ap)+Number(An)+Number(Bp)+Number(Bn)+Number(ABp)+Number(ABn)+Number(Op)+Number(On)
        }
    });
    newUser.save().then(() => {
        res.send("Bank Detail done");
    }).catch((err) => {
        console.log(err);
        res.send("error in userdetail");
    })
});

router.post("/getbank" , checkAuthentication , (req , res) => {
    const user = req.user;
    bbank.findOne({username : user.username} , (err ,bbank) => {
        if(err){
            console.log(err);
            res.send("User Not Found");
        }
        res.json({user : user , bbank : bbank})
    })
});

router.post("/bbank_filter" , checkAuthentication , (req , res) => {
    let {name ,state} = req.body;
    if(name){
        bbank.findOne({name : name} , (err , b_bank) => {
            res.json(b_bank);
        });
    }
    User.find({state : state} , (err , bbanklist) => {
        const fromArr = bbanklist.map(({username}) => username);
        bbank.find({username : {$in : fromArr}} , (err , bloodbank) => {
            const userData = bloodbank.map(({
                username : username,
                name,
                blood,
            }) => {
               return {
                  username,
                  name,
                  blood,
               };
            });
            res.send([userData , bbanklist])
        })
    });
    
});

module.exports = router;