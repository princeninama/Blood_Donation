const router = require("express").Router();
const { checkAuthentication } = require("../middleware/authentication");
const { Donor } = require("../schemas/donor");
const { Receive } = require("../schemas/receiver");
const { MainUser, User } = require("../schemas/user");
const { route } = require("./api");
const { bbank } = require("../schemas/blood_bank");

router.get("/",function(req,res){
    res.render("index");
});

router.post("/donate", checkAuthentication, function (req, res) {
    const user = req.user;
    const { blood_group, quantity } = req.body;
    const donate = new Donor({
        username: user.username,
        blood_grp: req.body.blood_group,
        quantity: req.body.quantity,
        date: req.body.date,
        accept: false
    });
    let blood = {};
    bbank.findOne({ username: user.username }, (err, bank) => {
        if (err) {
            console.log(err);
        }
        blood = bank.blood;
        if (blood_group == "Ap") {
            blood.Ap = blood.Ap + Number(quantity);
        }
        else if (blood_group == "An") {
            blood.An = blood.An + Number(quantity);
        }
        else if (blood_group == "Bp") {
            blood.Bp = blood.Bp + Number(quantity);
        }
        else if (blood_group == "Bn") {
            blood.Bn = blood.Bn + Number(quantity);
        }
        else if (blood_group == "ABp") {
            blood.ABp = blood.ABp + Number(quantity);
        }
        else if (blood_group == "ABn") {
            blood.ABn = blood.ABn + Number(quantity);
        }
        else if (blood_group == "Op") {
            blood.Op = blood.Op + Number(quantity);
        }
        else if (blood_group == "On") {
            blood.On = blood.On + Number(quantity);
        }
        bbank.updateOne({ username: user.username }, { blood: blood }, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(docs);
            }
        });
    });
    donate.save().then(() => {
        res.send("donotaion accepted");
    }).catch((err) => {
        console.log(err);
    });
});

router.post("/receive", checkAuthentication, function (req, res) {
    const user = req.user;
    const receive = new Receive({
        username: user.username,
        blood_grp: req.body.blood_group,
        quantity: req.body.quentity,
        date: req.body.date,
        accept: false
    });

    let blood = {};
    bbank.findOne({ username: user.username }, (err, bank) => {
        if (err) {
            console.log(err);
        }
        blood = bank.blood;
        if (blood_group == "Ap") {
            blood.Ap = blood.Ap - Number(quantity);
        }
        else if (blood_group == "An") {
            blood.An = blood.An - Number(quantity);
        }
        else if (blood_group == "Bp") {
            blood.Bp = blood.Bp - Number(quantity);
        }
        else if (blood_group == "Bn") {
            blood.Bn = blood.Bn - Number(quantity);
        }
        else if (blood_group == "ABp") {
            blood.ABp = blood.ABp - Number(quantity);
        }
        else if (blood_group == "ABn") {
            blood.ABn = blood.ABn - Number(quantity);
        }
        else if (blood_group == "Op") {
            blood.Op = blood.Op - Number(quantity);
        }
        else if (blood_group == "On") {
            blood.On = blood.On - Number(quantity);
        }
        bbank.updateOne({ username: user.username }, { blood: blood }, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(docs);
            }
        });
    });

    receive.save().then(() => {
        res.send("receive requested");
    }).catch((err) => {
        console.log(err);
    });
});

// router.post("/userdetail" ,checkAuthentication , (req , res) => {
//     const {name,addres,blood_grp,dob} = req.body;
//     const username = req.user.username;
//     const newUser = new MainUser({
//         username : username,
//         name : name,
//         addres : addres,
//         blood_grp : blood_grp,
//         dob : dob,
//     });
//     newUser.save().then(() => {
//         res.send("User Detail done");
//     }).catch((err) => {
//         console.log(err);
//         res.send("error in userdetail");
//     })
// });

router.post("/getuser", checkAuthentication, (req, res) => {
    const user = req.user;
    const state = user.state;
    User.find({ state: state }, (err, bbanklist) => {
        const fromArr = bbanklist.map(({ username }) => username);
        bbank.find({ username: { $in: fromArr } }, (err, bloodbank) => {
            const userData = bloodbank.map(({
                username: username,
                name,
                blood,
            }) => {
                return {
                    username,
                    name,
                    blood,
                };
            });

            res.render("user", { user: user, banklist: userData });
        })
    })});



    router.post("/bankdetail", checkAuthentication, (req, res) => {
        const { name, Ap, An, Bp, Bn, ABp, ABn, Op, On } = req.body;
        const username = req.user.username;
        const newUser = new bbank({
            username: username,
            name: name,
            blood: {
                Ap: Number(Ap),
                An: Number(An),
                Bp: Number(Bp),
                Bn: Number(Bn),
                ABp: Number(ABp),
                ABn: Number(ABn),
                Op: Number(On),
                On: Number(On),
                total: Number(Ap) + Number(An) + Number(Bp) + Number(Bn) + Number(ABp) + Number(ABn) + Number(Op) + Number(On)
            }
        });
        newUser.save().then(() => {
            res.send("Bank Detail done");
        }).catch((err) => {
            console.log(err);
            res.send("error in userdetail");
        })
    });

    router.post("/getbank", checkAuthentication, (req, res) => {
        const user = req.user;
        bbank.findOne({ username: user.username }, (err, bbank) => {
            if (err) {
                console.log(err);
                res.send("User Not Found");
            }
            res.render("bloodbank", { user: user, bbank: bbank })
        })
    });

    router.post("/bbank_filter", checkAuthentication, (req, res) => {
        let { name, state } = req.body;
        if (name) {
            bbank.findOne({ name: name }, (err, b_bank) => {
                res.json(b_bank);
            });
        }
        User.find({ state: state }, (err, bbanklist) => {
            const fromArr = bbanklist.map(({ username }) => username);
            bbank.find({ username: { $in: fromArr } }, (err, bloodbank) => {
                const userData = bloodbank.map(({
                    username: username,
                    name,
                    blood,
                }) => {
                    return {
                        username,
                        name,
                        blood,
                    };
                });
                res.render("availability", { userdata: userData, banklist: bbanklist });
            })
        });

    });

    module.exports = router;