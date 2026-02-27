const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const { createCategory, getAllCategories } = require("../../controllers/categories/categoriesController");
const asyncHandler = require("../../utils/asyncHandler");
const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, asyncHandler(createCategory));

categoriesRouter.get("/",asyncHandler(getAllCategories));

module.exports = categoriesRouter;