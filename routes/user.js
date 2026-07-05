const express= require("express");
const router= express.Router();
const User= require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware");


router.get("/signup",(req,res)=>{
//    res.send("form");
   res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username,password,email}=req.body;
    const newUser= new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }  
    req.flash("success","welcome to TravelDaut");
    // res.send(registeredUser);
    console.log(registeredUser);
    res.redirect("/listings");
    });

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

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),async(req,res)=>{

      console.log("Login successful");
    console.log(req.user);
     req.flash("success","Welcome to TravelDaut!, You are logged in!");
        // res.redirect("/listings")
        // res.redirect(req.session.redirectUrl);

        let redirectUrl= res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
})

module.exports= router;