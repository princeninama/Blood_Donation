const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// importing schemas
const { User } = require("./schemas/user.js");

// connecting data base
mongoose
    .connect("mongodb://127.0.0.1:27017/acvDB")
    .then((res) => console.log("Connected to MongoDB"))
    .catch((err) => console.log("ERROR: ", err));

app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "Our Secret key of session",
        resave: false,
        saveUninitialized: false,
        // cookie: { secure: false },
    })
);

passport.use(User.createStrategy());

//starting the session
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==================================================================================================================================//

app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/authentication"));

app.listen(4000, () => {
    console.log("Server Started on port 4000");
});
