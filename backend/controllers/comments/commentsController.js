const Comment = require("../../models/Comments/Comment");
const Post = require("../../models/Posts/Post");
//@desc create a comment
//@route POST /api/V1/comments
//@access private
module.exports.createComment = async (req, res, next) => {
  const { message, postId } = req.body;
  const trimmedMessage = message.trim();
  if (trimmedMessage === "") {
    throw new Error("Empty comment is not accepted");
  }
  const newComment = new Comment({
    message: trimmedMessage,
    postId,
    author: req.userAuth._id,
  });
  await newComment.save();
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: newComment._id } },
    { new: true },
  );
  res.json({
    status: "Success",
    message: "Comment created successfully",
    newComment,
    updatedPost,
  });
};

//@desc create a comment
//@route DELETE /api/V1/comments/:id
//@access private
module.exports.deleteComment = async (req, res, next) => {
  console.log("Controller");
  const commentToDelete = await Comment.findById(req.params.id);
  await Post.findByIdAndUpdate(commentToDelete.postId, {
    $pull: { comments: commentToDelete._id },
  });
  await Comment.findByIdAndDelete(req.params.id);
  res.json({
    status: "Success",
    message: "Comment deleted successfully",
    commentToDelete,
  });
};

//@desc update a comment
//@route PUT /api/V1/comments/:id
//@access private
module.exports.updateComment = async (req, res, next) => {
  console.log("Controller");
  const comment = req.body;
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    comment,
    { new: true, runValidators: true },
  );
  res.json({
    status: "Success",
    message: "Comment updated successfully",
    updatedComment,
  });
};
