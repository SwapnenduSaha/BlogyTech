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
module.exports.getAllCategories = async (req,res,next) => {
  const categories = await Category.find({});
  res.json({
    status:"Success",
    message:"All categories fetched successfully",
    categories
  });
}

