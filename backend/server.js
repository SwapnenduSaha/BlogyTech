const express = require("express");
const dotenv = require("dotenv");
const usersRouter = require("./routes/users/usersRouter");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
const connectDB = require("./config/databaseConnection");
connectDB();
app.use(express.json());

app.use("/api/V1/users",usersRouter);


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
