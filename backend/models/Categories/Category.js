const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
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
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      }
    ],
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
