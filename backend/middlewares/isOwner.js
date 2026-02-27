const mongoose  = require("mongoose");
const Category = require("../models/Categories/Category");

module.exports.isOwner = async (req,res,next) => {
    const categoryId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(categoryId)){
        throw new Error("Request for invalid categories");
    }
    const category = await Category.findById(categoryId);
    if(!category){
        throw new Error("No such category exists");
    } else if(!category.author.equals(req.userAuth._id)){
        throw new Error("Only the author can delete or update");
    } else {
        req.category = category;
        next();
    }
}