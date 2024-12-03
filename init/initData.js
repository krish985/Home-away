const mongoose = require('mongoose');
const sampleData = require('./data1.js');
const Listing = require('../model/listing.js');

const URL = process.env.MONGO_URL;

async function connectDb(){
    await mongoose.connect(URL);
};

connectDb().then((response)=>{
    console.log('Database connection Established Succesfull');
}).catch((error)=>{
    console.log(`Some error occured to connecting with databases${error}`);
});

async function generateData(){
    await Listing.deleteMany({});
    sampleData.data = sampleData.data.map((obj)=>({
        ...obj,
        owner : "674e8afa122154b4c3e9c670"
    }))
    await Listing.insertMany(sampleData.data);
    console.log('data saved succesfully in db.')
}

generateData()

