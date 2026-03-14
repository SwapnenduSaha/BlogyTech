const User = require("../models/Users/User");

const isVerified = async (req, res, next) => {
  //Fetching the full details of logged in user
  const currentUser = await User.findById(req.userAuth._id);
  //Checking if the user is verified
  if (!currentUser.isVerified) {
    throw new Error("You are not verified");
  }
  //Allowing user to create post if verified
  next();
};

module.exports = isVerified;
