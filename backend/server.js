const express = require("express");
const dotenv = require("dotenv");
const usersRouter = require("./routes/users/usersRouter");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
const connectDB = require("./config/databaseConnection");
connectDB();
app.use(express.json());

app.use("/api/V1/users", usersRouter);

app.use((req,res,next) => {
  const err = new Error(`Not found ${req.originalUrl} on the server`);
  next(err);
})


app.use((err, req, res, next) => {
  const status = err?.status ? err.status : "Failed";
  const message = err?.message;
  const stack = err?.stack;
  res.status(500).json({ status, message, stack });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
