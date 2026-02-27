const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categories/categoriesController");
const asyncHandler = require("../../utils/asyncHandler");
const { isOwner } = require("../../middlewares/isOwner");
const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, asyncHandler(createCategory));

categoriesRouter.get("/", asyncHandler(getAllCategories));

categoriesRouter.delete(
  "/:id",
  isLoggedIn,
  asyncHandler(isOwner),
  asyncHandler(deleteCategory),
);

categoriesRouter.put(
  "/:id",
  isLoggedIn,
  asyncHandler(isOwner),
  asyncHandler(updateCategory),
);

module.exports = categoriesRouter;
