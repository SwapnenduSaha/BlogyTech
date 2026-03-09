const express = require("express");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  viewAnotherProfile,
  followUser,
  unfollowUser,
} = require("../../controllers/users/usersController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const asyncHandler = require("../../utils/asyncHandler");
const usersRouter = express.Router();

usersRouter.post("/register", asyncHandler(register));

usersRouter.post("/login", asyncHandler(login));

usersRouter.get("/profile", isLoggedIn, asyncHandler(getProfile));

usersRouter.get("/:profileIdToView",isLoggedIn,asyncHandler(viewAnotherProfile));

usersRouter.put("/block/:userIdToBlock",isLoggedIn,asyncHandler(blockUser));

usersRouter.put("/unblock/:userIdToUnblock",isLoggedIn,asyncHandler(unblockUser));

usersRouter.put("/following/:userIdToFollow",isLoggedIn,asyncHandler(followUser));

usersRouter.put("/unfollowing/:userIdToUnfollow",isLoggedIn,asyncHandler(unfollowUser));

module.exports = usersRouter;
