const User = require("../../models/Users/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

//@desc Register new user
//@route POST /api/V1/users/register
//@access public
module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const isPresent = await User.findOne({ username });
  if (isPresent) {
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
};

//@desc login user
//@route POST /api/V1/users/login
//@access public
module.exports.login = async (req, res, next) => {
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
};

//@desc profile view
//@route GET /api/V1/users/profile/:id
//@access private
module.exports.getProfile = async (req, res, next) => {
  const user = await User.findById(req.userAuth._id);
  res.json({
    status: "Success",
    message: "Profile fetched",
    user,
  });
};

//@desc block user
//@route POST /api/V1/users/block/:userIdToBlock
//@access private
module.exports.blockUser = async (req, res, next) => {
  //Id of the user to be blocked
  const { userIdToBlock } = req.params;
  //Id of the current user
  const currentUserId = req.userAuth._id;
  //Fetching the user to be blocked
  const userToBlock = await User.findById(userIdToBlock);
  //Checking the user to be blocked exist or not
  if (!userToBlock) {
    throw new Error("User does not exist");
  }
  //Checking self blocking condition
  if (userIdToBlock === currentUserId.toString()) {
    throw new Error("Can't block yourself");
  }
  //Fetching the current user
  const currentUser = await User.findById(currentUserId);
  //Checking the user to be blocked is already blocked or not
  if (currentUser.blockedUsers.includes(userIdToBlock)) {
    throw new Error("User already blocked");
  }
  //Pushing the user id to be blocked to the blockedUsers of the current user
  const updatedUser = await User.findByIdAndUpdate(
    currentUserId,
    {
      $push: { blockedUsers: userIdToBlock },
    },
    { new: true },
  );
  //Returning response
  res.json({
    status: "Success",
    message: "User blocked successfully",
    updatedUser,
  });
};

//@desc unblock user
//@route POST /api/V1/users/unblock/:userIdToUnblock
//@access private
module.exports.unblockUser = async (req, res, next) => {
  //Id of the user to be unblocked
  const { userIdToUnblock } = req.params;
  //Id of the current user
  const currentUserId = req.userAuth._id;
  //Checking the user to be Unblocked exist or not
  const userToUnblock = await User.findById(userIdToUnblock);
  if (!userToUnblock) {
    throw new Error("User does not exist");
  }
  //Checking self unblocking condition
  if (userIdToUnblock === currentUserId.toString()) {
    throw new Error("Can't unblock yourself");
  }
  //Fetching the current user
  const currentUser = await User.findById(currentUserId);
  //Checking if the user is blocked or not
  if (!currentUser.blockedUsers.includes(userIdToUnblock)) {
    throw new Error("User is not blocked");
  }
  //removing the userIdToUnblock from the blockedUsers of the current user
  const updatedUser = await User.findByIdAndUpdate(
    currentUserId,
    { $pull: { blockedUsers: userIdToUnblock } },
    { new: true },
  );
  //Returning response
  res.json({
    status: "Success",
    message: "User unblocked successfully",
    updatedUser,
  });
};
