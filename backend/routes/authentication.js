const router = require("express").Router();
const nodemailer = require("nodemailer");
const passport = require("passport");
// const transporter = require
const { checkAuthentication } = require("../middleware/authentication");
const { User } = require("../schemas/user");

//nodemailer Transporter
var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "2fc4d046191d9f",
        pass: "d61e71f1a9d566",
    },
});

//===================================================================================================================================//
// signup APIs
//===================================================================================================================================//
router.get("/signup", (req, res) => {
    res.send("SignUp Page");
});
router.post("/signup", (req, res) => {
    const otp = String(Math.floor(Math.random() * 1000000));
    const { fname, lname, username,b_group, profession, email, mobile, password,state } = req.body;
    const newUser = {
        name: `${fname} ${lname}`,
        username: username,
        profession: profession,
        state : state,
        b_group : b_group,
        email: email,
        mobile: mobile,
        isActive: false,
        otp: otp,
    };
    User.register(newUser, password, async (err, user) => {
        if (err) {
            console.log(err);
            res.json({ success: false, error: err.message });
        } else {
            // const user = await User.findOne({ email: email });

            let mailOptions = {
                from: "moonpatel663@gmail.com", // sender address
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
                    res.json({
                        success: true,
                        authToken,
                        user: { name: `${newUser.name}`, username: `${newUser.username}` },
                    });
                }
            });
            res.cookie("username", user.username, { httpOnly: true }).json({ success: true });
        }
    });
});

//================================================================================================================================//
// login APIs
//================================================================================================================================//
router.post("/check-email", (req, res) => {
    const { otp } = req.body;
    const { username } = req.cookies;
    User.findOne({ username: username }, (err, user) => {
        if (user.isActive) return res.json({ err: "User already activated" });
        if (user.otp == otp) {
            User.updateOne({ username: username }, { isActive: true }, (err) => {
                if (err) console.log(err);
            });
            res.json({ success: true });
        } else {
            res.render("checkEmail", { user });
        }
    });
});

router.post("/login", async (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        console.log(user);
        if (err) {
            console.log(err);
            res.json({ success: false, err });
        } else if (user.isActive) {
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
            });
            req.login(newUser, (err) => {
                if (err) {
                    console.log(err);
                    res.json({ success: false, err });
                } else {
                    passport.authenticate("local")(req, res, () => {
                        res.cookie("username", user.username, { httpOnly: true }).json({ success: true });
                    });
                }
            });
        } else {
            res.json({
                err: "User Is Not Active Please Verify Your Email",
                username: user.username,
                email: user.email,
            });
        }
    });
});

//===================================================================================================================================
// for changing password
//===================================================================================================================================
router.post("/changepassword", checkAuthentication, (req, res, next) => {
    const User = req.user;
    User.changePassword(req.body.oldPassword, req.body.newPassword, (err) => {
        if (err) {
            return res.json(err);
        }
        return res.json({ success: true });
    });
});

//===================================================================================================================================
// for forgot password
//===================================================================================================================================
router.post("/forgotpassword", (req, res) => {
    let userName = req.body.hidden; // here i need username of User like you can insert input hidden filed to maintain username
    User.findOne({ username: userName }, (err, user) => {
        if (err) {
            res.json({ success: false, err });
        } else {
            user.otp = String(Math.floor(Math.random() * 1000000));
            // mail info
            // we have to enter mail info template to butify our email
            let mailOptions = {
                from: "tempmail@gmail.com", // sender address
                to: `${user.email}`, // list of receivers
                subject: "Hello Forget Password Something", // Subject line
                text: `Hii Greetinfs From SVNIT.
                        please Enter The Otp To Reset Your Password.`, // plain text body
                html: `<button>${user.otp}</button>`, // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json(error);
                } else {
                    res.json(user);
                }
            });
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
                user.setPassword(req.body.password, (err, user) => {
                    if (err) {
                        res.json({ success: false, err });
                    } else {
                        res.json({ success: true, user });
                    }
                });
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

module.exports = router;
