const jwt = require("jsonwebtoken");
const User = require("../models/Users/User");

const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      next(err);
    } else {
      const userId = decoded.user.id;
      const user = await User.findById(userId).select("username _id email role");
      req.userAuth = user;
      next();
    }
  });
};

module.exports = isLoggedIn;
