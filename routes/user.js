const express= require("express");
const router= express.Router();
const User= require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");


router.get("/signup",(req,res)=>{
//    res.send("form");
   res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username,password,email}=req.body;
    const newUser= new User({email,password,username});
    const registeredUser=await User.register(newUser,password);
    req.flash("success","welcoe to TravelDaut");
    // res.send(registeredUser);
    console.log(registeredUser);
    res.redirect("/listings");
    }
    catch(error){
        console.log(error);
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}));


router.get("/login",wrapAsync(async(req,res)=>{
    try{
        res.render("users/login.ejs");
    }catch(error){
        console.log("error",error);
        res.redirect("/login");
    }
}));
// router.post("/login",passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), async(req,res)=>{
//         // res.send("Welcome to TravelDaut!, You are logged in!");
//         req.flash("Welcome to TravelDaut!, You are logged in!");
//         res.redirect("/listings")
   
// });

router.post("/login", passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),async(req,res)=>{

      console.log("Login successful");
    console.log(req.user);
     req.flash("success","Welcome to TravelDaut!, You are logged in!");
        res.redirect("/listings")
})

module.exports= router;