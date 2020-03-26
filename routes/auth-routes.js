const router = require("express").Router();
const passport = require("passport");

// show login page
router.get("/login", (req, res) => {
    res.render("/login.html", {user: req.user});
});

// login using google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

//if login success, redirect here
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    // res.send(req.user);
    res.redirect("/หน้าแรกกรรมการ.html");
});

//logout
router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

module.exports = router;