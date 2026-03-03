const mongoose = require("mongoose");
const Category = require("../../models/Categories/Category");
const Post = require("../../models/Posts/Post");
const User = require("../../models/Users/User");

//@desc creates a post
//@route POST /api/V1/posts
//@access private
module.exports.createPost = async (req, res, next) => {
  const { title, content, categoryId } = req.body;
  const isPresent = await Post.findOne({ title });
  if (isPresent) {
    throw new Error("Post already present");
  }
  const newPost = new Post({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
  });
  await newPost.save();
  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      $push: { posts: newPost },
    },
    { new: true },
  );
  const user = await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: newPost._id },
    },
    { new: true },
  );
  res.json({
    status: "Success",
    message: "Post successfully created",
    newPost,
    user,
    category,
  });
};

//@desc get all posts
//@route GET /api/V1/posts
//@access public
module.exports.getAllPosts = async (req, res, next) => {
  const allPosts = await Post.find({});
  res.json({
    status: "Success",
    message: "All posts fetched successfully",
    allPosts,
  });
};

//@desc get single posts
//@route GET /api/V1/posts/:id
//@access public
module.exports.getPost = async (req, res, next) => {
  const categoryId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Request for invalid categories");
  }
  const post = await Post.findById(categoryId);
  if (!post) {
    throw new Error("Post doesn't exist");
  }
  res.json({
    status: "Success",
    message: "Post fetched successfully",
    post,
  });
};

//@desc delete a post
//@route DELETE /api/V1/posts/:id
//@access private
module.exports.deletePost = async (req, res, next) => {
  const postToDelete = await Post.findById(req.params.id);
  await Category.findByIdAndUpdate(postToDelete.category, {
    $pull: { posts: postToDelete._id },
  });
  await User.findByIdAndUpdate(postToDelete.author,{$pull:{posts:postToDelete._id}});
  await Post.findByIdAndDelete(req.params.id);
  res.json({
    status: "Success",
    message: "Post successfully deleted",
    deletedPost:postToDelete,
  });
};

//@desc update a post
//@route PUT /api/V1/posts/:id
//@access private
module.exports.updatePost = async (req, res, next) => {
  const post = req.body;
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, post, {
    new: true,
    runValidators: true,
  });
  res.json({
    status: "Success",
    message: "Post updated successfully",
    updatedPost,
  });
};
