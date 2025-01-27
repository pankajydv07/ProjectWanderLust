
const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js");

main()
.then((res)=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}

const initDB = async()=>{
    await Listing.deleteMany();
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:'6790b908ed6ef3a368e40b37'
    }));
    await Listing.insertMany(initData.data);
    console.log("database is initialized");
}
initDB();