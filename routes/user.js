const express = require("express");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
.route("/signup")
.get(userController.showSignUpForm)
.post(userController.signup);


router
.route("/login")
.get(userController.loginForm)
.post(savedRedirectUrl,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),userController.login);



router.get("/logout",userController.logout);

module.exports =router;