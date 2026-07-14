const express= require("express");
const router= express.Router();
const User= require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware");


const userController= require("../controllers/users");


router.get("/signup",userController.signupForm);

router.post("/signup",wrapAsync(userController.signup));


router.get("/login",wrapAsync(userController.renderLoginForm));


// router.post("/login",passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), async(req,res)=>{
//         // res.send("Welcome to TravelDaut!, You are logged in!");
//         req.flash("Welcome to TravelDaut!, You are logged in!");
//         res.redirect("/listings")
   
// });

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),userController.login);

router.get("/logout",userController.logout)

module.exports= router;