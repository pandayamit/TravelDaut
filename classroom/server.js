const express= require("express");
const app =express();
const cookieParser=require("cookie-parser");

const port=3000;

app.use(cookieParser("secretcode"));

app.get("/",(req,res)=>{
    console.log("hello, I am root")
    res.cookie("name","Amit");
    res.cookie("greet","Namaste");
    res.send("hello");
})


app.get("/getCookies",(req,res)=>{
    console.log(req.cookies);
    res.send("hello i am get cookies");
});

app.get("/greet",(req,res)=>{
    let {name = "anonymous"}=req.cookies;
    res.send(`hi ${name}`);
})

// signed cookies
app.get("/getSignedCookies",(req,res)=>{
    res.cookie("made-in","INDIA", {signed:true});
    res.send("signed cookie send TO YOU ")
});
app.get("/verify",(req,res)=>{
   console.log(req.signedCookies);
    res.send("signed cookie send ");
});



app.listen(port,()=>{
 console.log(`server is listening to port ${port}`)
})