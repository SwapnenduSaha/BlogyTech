const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Successfully connected to database");
  } catch (err) {
    console.log("Failure: "+err.message);
  }
};

module.exports = connectDB;
