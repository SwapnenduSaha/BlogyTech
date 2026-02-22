const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../../controllers/users/usersController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const asyncHandler = require("../../utils/asyncHandler");
const usersRouter = express.Router();

usersRouter.post("/register", asyncHandler(register));

usersRouter.post("/login", asyncHandler(login));

usersRouter.get("/profile", isLoggedIn, asyncHandler(getProfile));

module.exports = usersRouter;
