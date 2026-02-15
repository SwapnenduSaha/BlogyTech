//@desc Register new user
//@route POST /api/V1/users/register
//@access public
const User = require("../../models/Users/User");
const bcrypt = require("bcryptjs");
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      throw new Error("Username already exists");
    } else {
      const newUser = new User({ username, email, password });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      await newUser.save();
      res.json({
        status: "Success",
        message: "User registered successfully",
        _id: newUser?._id,
        username: newUser?.username,
        email: newUser?.email,
        role: newUser?.role,
      });
    }
  } catch (err) {
    res.json({
      status: "Failure",
      message: err.message,
    });
  }
};
