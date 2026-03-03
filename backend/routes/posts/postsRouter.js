const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const asyncHandler = require("../../utils/asyncHandler");
const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  updatePost,
} = require("../../controllers/posts/postsController");
const { isOwner } = require("../../middlewares/isOwner");
const Post = require("../../models/Posts/Post");
const postsRouter = express.Router();

postsRouter.post("/", isLoggedIn, asyncHandler(createPost));

postsRouter.get("/", asyncHandler(getAllPosts));

postsRouter.get("/:id", asyncHandler(getPost));

postsRouter.delete("/:id", isLoggedIn, isOwner(Post), asyncHandler(deletePost));

postsRouter.put("/:id", isLoggedIn, isOwner(Post), asyncHandler(updatePost));

module.exports = postsRouter;
