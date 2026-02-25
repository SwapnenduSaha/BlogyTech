const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
const connectDB = require("./config/databaseConnection");
const { globalErrorHandler, notFoundHandler } = require("./middlewares/globalErrorHandler");
const usersRouter = require("./routes/users/usersRouter");
const categoriesRouter = require("./routes/categories/categoriesRouter");
connectDB();
app.use(express.json());

//?Setup the User router
app.use("/api/V1/users",usersRouter);

//?Setup the Category router
app.use("/api/V1/categories", categoriesRouter);

//?Not found error handler 
app.use(notFoundHandler);

//?Global error handler
app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("Home page");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
