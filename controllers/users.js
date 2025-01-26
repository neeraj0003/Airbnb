const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "Welcome to Aasaan Aavaas!");
                res.redirect("/listings");
            }
        });
        // console.log(registeredUser);
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogInForm = (req, res) => {
    res.render("users/login.ejs");
};

//actual login is done by passport but for simplicity we are giving this name
//this callback function active after successful login
module.exports.login = async (req, res) => {
    req.flash("success", `Welcome to wandelust! ${req.body.username}`);
    //if we directly click login 
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "Successfully Logged Out!");
            res.redirect("/listings");
        }
    })
};