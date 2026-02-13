const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
const connectDB = require("./config/databaseConnection");
connectDB();


app.get("/", (req, res) => {
  res.send("Home page");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
