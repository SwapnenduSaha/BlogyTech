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
    image: req.file.path,
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
//@access private
module.exports.getAllPosts = async (req, res, next) => {
  //Fetching the id of logged in user
  const currentUserId = req.userAuth._id;
  //Fetching all the posts from DB and populating author field but only bringing the blockedUsers array
  //Fetching only the posts where scheduledPublished date is earlier than now (already published) orscheduledPublished is null(no scheduling)
  const allPosts = await Post.find({
    $or: [
      { scheduledPublished: { $lt: new Date() } },
      { scheduledPublished: null },
    ],
  }).populate("author", "blockedUsers");
  // Filter posts to remove posts from authors who blocked the current user
  const filteredPost = allPosts.filter(
    (post) =>
      !post.author.blockedUsers.some(
        (id) => id.toString() === currentUserId.toString(),
      ),
  );
  //Sending response
  res.json({
    status: "Success",
    message: "All posts fetched successfully",
    filteredPost,
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
  await User.findByIdAndUpdate(postToDelete.author, {
    $pull: { posts: postToDelete._id },
  });
  await Post.findByIdAndDelete(req.params.id);
  res.json({
    status: "Success",
    message: "Post successfully deleted",
    deletedPost: postToDelete,
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

//@desc like a post
//@route PUT /api/V1/posts/like/:id
//@access private
module.exports.likePost = async (req, res, next) => {
  //Fetching the id of post
  const postId = req.params.id;
  //Checking if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  //Fetching the id of logged in user
  const currentUserId = req.userAuth._id;
  //Adding user to likedBy and remove from disLikedBy if present
  await Post.findByIdAndUpdate(postId, {
    $addToSet: { likedBy: currentUserId },
    $pull: { disLikedBy: currentUserId },
  });
  //Added the post in likedPost
  await User.findByIdAndUpdate(currentUserId, {
    $addToSet: { likedPosts: postId },
  });
  //Sending response
  res.json({
    status: "Success",
    message: "Like added successfully",
  });
};

//@desc dislike a post
//@route PUT /api/V1/posts/dislike/:id
//@access private
module.exports.disLikePost = async (req, res, next) => {
  //Fetching the id of post
  const postId = req.params.id;
  //Checking if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  //Fetching the id of logged in user
  const currentUserId = req.userAuth._id;
  //Removing the like from liked posts
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { likedPosts: postId },
  });
  //Adding the user in disliked by and removing from liked by if present
  await Post.findByIdAndUpdate(postId, {
    $addToSet: { disLikedBy: currentUserId },
    $pull: { likedBy: currentUserId },
  });
  //Sending response
  res.json({
    status: "Success",
    message: "Dislike added successfully",
  });
};

//@desc clap a post
//@route PUT /api/V1/posts/claps/:id
//@access private
module.exports.clapPost = async (req, res, next) => {
  //Fetching the id of the post
  const postId = req.params.id;
  //Checking if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  //Updating claps of the post by 1
  await Post.findByIdAndUpdate(postId, { $inc: { claps: 1 } });
  //Sending response
  res.json({
    status: "Success",
    message: "Claps added successfully",
  });
};

//@desc schedule a post
//@route PUT /api/V1/posts/schedule/:id
//@access private
module.exports.schedulePost = async (req, res, next) => {
  //Fetching the id of the post
  const postId = req.params.id;
  //Validating the request body
  if (
    !req.body ||
    !req.body.scheduledPublished ||
    isNaN(Date.parse(req.body.scheduledPublished))
  ) {
    throw new Error("No proper date for scheduling");
  }
  const scheduledDate = new Date(req.body.scheduledPublished);
  if (scheduledDate < new Date()) {
    throw new Error("Can't schedule previous date");
  }
  //Updating document
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { scheduledPublished: scheduledDate },
    { new: true, runValidators: true },
  );
  //Sending response
  res.json({
    status: "Success",
    message: "Date is scheduled successfully",
    timeScheduled: updatedPost.scheduledPublished,
  });
};
