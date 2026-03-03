const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../../controllers/comments/commentsController");
const asyncHandler = require("../../utils/asyncHandler");
const { isOwner } = require("../../middlewares/isOwner");
const Comment = require("../../models/Comments/Comment");
const commentsRouter = express.Router();

commentsRouter.post("/", isLoggedIn, asyncHandler(createComment));

commentsRouter.put(
  "/:id",
  isLoggedIn,
  isOwner(Comment),
  asyncHandler(updateComment),
);

commentsRouter.delete(
  "/:id",
  isLoggedIn,
  isOwner(Comment),
  asyncHandler(deleteComment),
);

module.exports = commentsRouter;
