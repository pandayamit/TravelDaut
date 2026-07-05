const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing= require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/traveldot");
}

main().then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
});





const initDB = async () => {
    await Listing.deleteMany({});
     initData.data= initData.data.map((obj)=>({...obj,owner:"6a4110fe99e7428a29877e8f"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();