const express = require("express");
const app= express();
const session=require("express-session");

const port=4000;

const sessionOptions={
  secret:"supersecret",
  resave:false,
  saveUninitialized:true
}
app.use(session(sessionOptions));


// app.get("/",(req,res)=>{
//   console.log("hello");
//   res.send("hello Amit")
// });

// app.get("/getCount",(req,res)=>{
//   if(req.session.count){
//     req.session.count++;
//   }else{
//     req.session.count=1
//   }
//   res.send(`You sent a request ${req.session.count} times`);
// });


app.get("/register",(req,res)=>{
  let {name="anonymous"}=req.query;
  req.session.name=name
  // res.send(name);
  res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
  res.send(`hello, ${req.session.name} `);
});

app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
})