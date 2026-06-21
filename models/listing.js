const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const Review=require("./reviews");


const listingSchema =new Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
  },
  image:{
    type:String,
    set:(v)=> v==="" ? "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60":v,
  },
  price:{
    type:Number,
  },
  location:{
    type:String,
  },
  country:{
    type:String,
  },
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    }
  ]
});


listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;