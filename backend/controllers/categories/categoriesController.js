const Category = require("../../models/Categories/Category");

//@desc create new category
//@route POST /api/V1/categories
//@access private
module.exports.createCategory = async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.findOne({ name });
  if (category) {
    throw new Error("Category already exists");
  } else {
    const newCategory = new Category({ name, author: req?.userAuth?._id });
    await newCategory.save();
    res.json({
      status: "Success",
      message: "Category created successfully",
      newCategory,
    });
  }
};

//@desc get all categories
//@route GET /api/V1/categories
//@access public
module.exports.getAllCategories = async (req, res, next) => {
  const categories = await Category.find({});
  res.json({
    status: "Success",
    message: "All categories fetched successfully",
    categories,
  });
};

//@desc delete single category
//@route DELETE /api/V1/categories/id
//@access private
module.exports.deleteCategory = async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "Success",
    message: "Category deleted",
    deletedCategory: category,
  });
};

//@desc update single category
//@route PUT /api/V1/categories/id
//@access private
module.exports.updateCategory = async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true, runValidators: true },
  );
  res.json({
    status: "Success",
    message: "Category updated",
    updatedCategory: category,
  });
};
