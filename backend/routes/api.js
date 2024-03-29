const router = require("express").Router();
const nodemailer = require("nodemailer");
const passport = require("passport");
const { checkAuthentication } = require("../middleware/authentication");
const { Donor } = require("../schemas/donor");
const { Receive } = require("../schemas/receiver");
const { MainUser, User } = require("../schemas/user");
const { route } = require("./api");
const { bbank } = require("../schemas/blood_bank");

router.get("/",function(req,res){
    res.render("index");
});

//nodemailer Transporter
var transporter = nodemailer.createTransport({
    service : 'gmail',
    auth: {
        user: "u21cs086@coed.svnit.ac.in",
        pass: "blnpp8923jqQ@",
    },
});

//===================================================================================================================================//
// signup APIs
//===================================================================================================================================//
router.get("/signup", (req, res) => {
    res.render("signup");
});
router.post("/signup", (req, res) => {
    const otp = String(Math.floor(Math.random() * 1000000));
    const {username, email, mobile, password,state,address,type} = req.body;
    console.log(type);
    let newUser = {}
    if(type === 'bloodbank'){
        newUser = {
            username: username,
            state : state,
            email: email,
            mobile: mobile,
            address : address,
            isActive: false,
            isAdmin : true,
            isFilled : false,
            otp: otp,
        };
    }
    else{
        newUser = {
            username: username,
            state : state,
            email: email,
            mobile: mobile,
            address : address,
            isActive: false,
            isAdmin : false,
            isFilled : false,
            otp: otp,
        };
    }
    
    User.register(newUser, password, async (err, user) => {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            // const user = await User.findOne({ email: email });

            let mailOptions = {
                from: "donate.blood24@gmail.com", // sender address
                to: `${user.email}`, // list of receivers
                subject: "Hello Thank you fro sign Up", // Subject line
                text: `Hii Greetings From SVNIT.
                        please Enter The Otp To Activate Your account.`, // plain text body
                html: `<button>${user.otp}</button>`, // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json({ success: false, error });
                } else {
                    res.cookie("username", user.username, { httpOnly: true }).render("verify")
                }
            });
        }
    });
});

//================================================================================================================================//
// login APIs
//================================================================================================================================//

router.get("/check-email" , (req , res)=> {
    res.render("verify");
})

router.post("/check-email", (req, res) => {
    const { otp } = req.body;
    const { username } = req.cookies;
    User.findOne({ username: username }, (err, user) => {
        if (user.isActive) return res.json({ err: "User already activated" });
        if (user.otp == otp) {
            User.updateOne({ username: username }, { isActive: true }, (err) => {
                if (err) {console.log(err);
                res.json(err)}
            });
            if(user.isAdmin){
                res.render("bankdetail");
            }
            else{
            res.redirect("/login");
            }
        } else {
            res.render("verify", { user });
        }
    });
});

router.get("/login",function(req,res){
    res.render("userlogin");
});

router.post("/login", async (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        console.log(user);
        if (err) {
            console.log(err);
            res.json({ success: false, err });
        }
        else if (user.isActive) {
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
            });
            console.log(newUser);
            req.login(newUser, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect("login");
                } else {
                    passport.authenticate("local")(req, res, () => {
                    if(user.isAdmin){
                        res.redirect("/getbank");
                    }
                    else{
                        res.redirect("/getuser");
                    }
                    });
                }
            });
        } else {
            res.render("verify");
        }
    });
});

router.get("/forget", (req , res) => {
    res.render("forget", {username : ""})
})

router.post("/forget", (req, res) => {
    let userName = req.body.username; // here i need username of User like you can insert input hidden filed to maintain username
    User.findOne({ username: userName }, (err, user) => {
        if (err) {
            res.json({ success: false, err });
        } else {
            let otp = String(Math.floor(Math.random() * 1000000));
            User.updateOne({username : userName} , {otp : otp} , (err , succ) => {
                // mail info
            // we have to enter mail info template to butify our email
            let mailOptions = {
                from: "u21cs086@coed.svnit.ac.in", // sender address
                to: `${user.email}`, // list of receivers
                subject: "Hello Forget Password Something", // Subject line
                text: `Hii Greetinfs From SVNIT.
                        please Enter The Otp To Reset Your Password.`, // plain text body
                html: `<button>${otp}</button>`, // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json(error);
                } else {
                    res.render("forget" , {username : userName});
                }
            });
            })
            
        }
    });
});

router.post("/fcpaaword", (req, res) => {
    let enterOtp = req.body.otp; //otp which user will enter
    let userName = req.body.username;
    User.findOne({ username: userName }, (err, user) => {
        if (err) {
            res.json({ success: false, err });
        } else {
            if (user.otp === enterOtp) {
                User.findByUsername(userName).then(function(sanitizedUser){
                    if (sanitizedUser){
                        sanitizedUser.setPassword(req.body.password, function(){
                            sanitizedUser.save();
                            res.status(200).redirect("/login");
                        });
                    } else {
                        res.status(500).json({message: 'This user does not exist'});
                    }
                },function(err){
                    console.error(err);
                })
            } else {
                res.json({
                    success: false,
                    error: "otp did not match",
                    username: user.username,
                    email: user.email,
                });
            }
        }
    });
});


router.post("/donate", checkAuthentication, function (req, res) {
    const user = req.user;
    const { blood_group, quantity , bloodbank } = req.body;
    bbank.findOne({ username: bloodbank}, (err, bank) => {
        if (err) {
            console.log(err);
        }
        let blood = bank.blood;
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
        blood.total = blood.total + Number(quantity);
        bbank.updateOne({ username: bloodbank }, { blood: blood }, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/getuser");
            }
        });
    });
});

router.post("/receive", checkAuthentication, function (req, res) {
    const { blood_group, quantity , bloodbank } = req.body;
    bbank.findOne({ username: bloodbank}, (err, bank) => {
        if (err) {
            console.log(err);
        }
        let blood = bank.blood;
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
        blood.total = blood.total - Number(quantity);
        bbank.updateOne({ username: bloodbank }, { blood: blood }, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/getuser");
            }
        });
    });
    });

router.get("/getuser", checkAuthentication, (req, res) => {
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


    router.post("/bankdetail", (req, res) => {
        const { Ap, An, Bp, Bn, ABp, ABn, Op, On } = req.body;
        const { username } = req.cookies;
        const newUser = new bbank({
            username: username,
            name: username,
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
            res.redirect("/login");
        }).catch((err) => {
            console.log(err);
            res.json(err);
        })
    });

    router.get("/getbank", checkAuthentication, (req, res) => {
        const user = req.user;
        bbank.findOne({ username: user.username }, (err, bbank) => {
            if (err) {
                console.log(err);
                res.send("User Not Found");
            }
            res.render("bloodbank", { user: user, bbank: bbank })
        })
    });

    router.get("/bbank_filter" , checkAuthentication , (req , res) => {
        res.render("availability" , {userdata : [] , banklist : []})
    });

    router.post("/bbank_filter", checkAuthentication, (req, res) => {
        let { name, state } = req.body;
        if (name) {
           bbank.findOne({username : name} , (err , blood) => {
                User.findOne({username : name} , (err , user) => {
                    let list = [user]
                    let list2 = [blood]
                    res.render("availability" ,{userdata : list , banklist : list2});
                })
           })
        }
        else{
        bbank.find({ state: state , isAdmin : true }, (err, bbanklist) => {
            const fromArr = bbanklist.map(({ username }) => username);
            User.find({ username: { $in: fromArr } }, (err, bloodbank) => {
                const userData = bloodbank.map(({
                    username: username,
                    address,
                    mobile,
                    email
                }) => {
                    return {
                        username,
                        address,
                        mobile,
                        email
                    };
                });
                res.render( "availability" ,{ userdata: userData, banklist: bbanklist });
            })
        });
    }

    });

    module.exports = router;