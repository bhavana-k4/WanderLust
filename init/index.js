const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.MAP_TOKEN) {
  console.error("ERROR: MAP_TOKEN is undefined. Make sure .env exists in project root and contains MAP_TOKEN=your_token_here");
  process.exit(1);
}

require("dotenv").config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});


const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const dbUrl=process.env.ATLASDB_URL;

main()
 .then(()=>{
    console.log("connected to DB")
 })
 .catch((err)=>{
    console.log(err);
 });

async function main(){
    await mongoose.connect(dbUrl);
};

// const initDB=async ()=>{
//     await Listing.deleteMany({});
//     initData.data=initData.data.map((obj)=>({...obj,owner:"68c65a11742bbc51835fae62"}));
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized")
// }
// initDB();

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Old data deleted!");

  for (let obj of initData.data) {
    const response = await geocodingClient
      .forwardGeocode({
        query: obj.location, // use location from your seed data
        limit: 1,
      })
      .send();

    const geoData = response.body.features[0].geometry;

    const newListing = new Listing({
      ...obj,
      owner: "68c65a11742bbc51835fae62", // your user id
      geometry: geoData, // auto coordinates from mapbox
    });

    await newListing.save();
    console.log(`✅ Added listing: ${obj.title}`);
  }

  console.log("✅ All data seeded successfully with geometry!");
};
initDB();