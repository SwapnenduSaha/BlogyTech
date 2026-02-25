const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const { createCategory } = require("../../controllers/categories/categoriesController");
const categoriesRouter = express.Router();

categoriesRouter.post("/",isLoggedIn,createCategory);

module.exports = categoriesRouter;