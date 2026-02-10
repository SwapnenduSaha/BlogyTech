const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    claps: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shares: {
      type: Number,
      default: 0,
    },
    postViews: {
      types: Number,
      default: 0,
    },
    category: {
      types: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    scheduledPublished: {
      type: Date,
      default: null,
    },
    likedBy: [{ types: mongoose.Schema.Types.ObjectId, ref: "User" }],
    disLikedBy: [{ types: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ types: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post",postSchema);
module.exports = Post;
