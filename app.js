const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const listings= require("./routes/listing.js");
const reviews= require("./routes/reviews.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/traveldot");
}
main().then((res) => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

let port = 8080;



app.get("/", (req, res) => {
    res.send("Working...")
});


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);





// app.get("/testListing", async (req,res) =>{
//   let sampleListing = new Listing({
//     title:"My New Villa",
//     description:"By the beach",
//     price:1200,
//     location:"Calangute, Goa",
//     country:"India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// })



// error handling middlewares

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // console.log(err.message);
    // res.send("Something went wrong");
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});