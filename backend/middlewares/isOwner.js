const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");

module.exports.isOwner = (model, fieldname = "author") =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid request");
    }
    const document = await model.findById(id);
    if (!document) {
      throw new Error("No available data");
    }
    if (!document[fieldname].equals(req.userAuth._id)) {
      throw new Error("Only the author can modify");
    }
    next();
  });
