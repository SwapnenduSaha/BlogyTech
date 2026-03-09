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
  }
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

//@desc view user's profile
//@route GET /api/V1/users/:profileIdToView
//@access private
module.exports.viewAnotherProfile = async (req, res, next) => {
  //Id of the user whose profile is to be viewed
  const { profileIdToView } = req.params;
  //Checking the profile to be viewed exist or not
  const profileToView = await User.findById(profileIdToView);
  if (!profileToView) {
    throw new Error("Profile doesn't exist");
  }
  //Id of the current user profile
  const currentUserId = req.userAuth._id;
  //Checking self viewing condition
  if (profileIdToView === currentUserId.toString()) {
    throw new Error("Self viewing will not be recorded as profile view");
  }
  //Checking was the profile already viewed by the cuurent user
  if (profileToView.profileViewers.includes(currentUserId)) {
    throw new Error("Profile previously viewed");
  }
  //Pushing current user id to the profileViewers of another user
  profileToView.profileViewers.push(currentUserId);
  //Saving the update inside DB
  await profileToView.save();
  //sending response
  res.json({
    status: "Success",
    message: "Profile view recorded",
  });
};

//@desc following user
//@route PUT /api/V1/users/following/:userIdToFollow
//@access private
module.exports.followUser = async (req, res, next) => {
  //Id of user to be followed
  const { userIdToFollow } = req.params;
  //Fetching the user to be followed
  const userToFollow = await User.findById(userIdToFollow);
  //Checking the user to be followed exists or not
  if (!userToFollow) {
    throw new Error("User doesn't exist");
  }
  //Id of current user
  const currentUserId = req.userAuth._id;
  //Fetching the profile of current user
  const currentUser = await User.findById(currentUserId);
  //Checking self following condition
  if (userIdToFollow === currentUserId.toString()) {
    throw new Error("Can't follow yourself");
  }
  //Checking the user to be followed is already followed
  if (userToFollow.followers.includes(currentUserId)) {
    throw new Error("Already followed");
  }
  //Pushing the current user id to the followers of the another user
  userToFollow.followers.push(currentUserId);
  //Pushing the followerd user's id to following of the current user
  currentUser.following.push(userIdToFollow);
  //Saving the updates inside DB
  await userToFollow.save();
  await currentUser.save();
  //Sending response
  res.json({
    status: "Success",
    message: "Follow and following recorded",
  });
};

//@desc unfollowing user
//@route PUT /api/V1/users/unfollowing/:userIdToUnfollow
//@access private
module.exports.unfollowUser = async (req, res, next) => {
  //Id of user to be unfollowed
  const { userIdToUnfollow } = req.params;
  //Fetching the user to be unfollowed
  const userToUnfollow = await User.findById(userIdToUnfollow);
  //Checking the user to be unfollowed exists or not
  if (!userToUnfollow) {
    throw new Error("User doesn't exist");
  }
  //Id of current user
  const currentUserId = req.userAuth._id;
  //Checking self unfollowing condition
  if (userIdToUnfollow === currentUserId.toString()) {
    throw new Error("Can't unfollow yourself");
  }
  //Checking the user to be unfollowed is currently followed or not
  if (!userToUnfollow.followers.includes(currentUserId)) {
    throw new Error("Not followed by you");
  }
  //Removing the current user id from the followers of the another user
  await User.findByIdAndUpdate(userIdToUnfollow, {
    $pull: { followers: currentUserId },
  });
  //Removing the unfollowed user's id from following of the current user
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { following: userIdToUnfollow },
  });
  //Sending the response
  res.json({
    status: "Success",
    message: "Unfollow and unfollowing recorded",
  });
};
