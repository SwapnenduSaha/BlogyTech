const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
const connectDB = require("./config/databaseConnection");
const {
  globalErrorHandler,
  notFoundHandler,
} = require("./middlewares/globalErrorHandler");
const usersRouter = require("./routes/users/usersRouter");
const categoriesRouter = require("./routes/categories/categoriesRouter");
const postsRouter = require("./routes/posts/postsRouter");
const commentsRouter = require("./routes/comments/commentsRouter");
const sendEmail = require("./utils/sendEmail");
connectDB();
app.use(express.json());

//?Setup the User router
app.use("/api/V1/users", usersRouter);

//?Setup the Category router
app.use("/api/V1/categories", categoriesRouter);

//?Setup the Post router
app.use("/api/V1/posts", postsRouter);

//?Setup the Comment router
app.use("/api/V1/comments", commentsRouter);

//?Not found error handler
app.use(notFoundHandler);

//?Global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
