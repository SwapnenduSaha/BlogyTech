//@desc Register new user
//@route POST /api/V1/users/register
//@access public
const User = require("../../models/Users/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
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
      message: err?.message,
    });
  }
};

//@desc login user
//@route POST /api/V1/users/login
//@access public
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid credentials");
    } else {
      const isMatched = await bcrypt.compare(password, user?.password);
      if (!isMatched) {
        throw new Error("Invalid credentials");
      } else {
        user.lastLogin = new Date();
        await user.save();
        res.json({
          status: "Success",
          _id: user?._id,
          username: user?.username,
          email: user?.email,
          role: user?.role,
          token: generateToken(user),
        });
      }
    }
  } catch (err) {
    res.json({ status: "Failure", message: err?.message });
  }
};

//@desc profile view
//@route GET /api/V1/users/profile/:id
//@access private
module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userAuth._id);
    res.json({
      status: "Success",
      message: "Profile fetched",
      user,
    });
  } catch (err) {
    res.json({
      status: "Failure",
      message: err?.message,
    });
  }
};
