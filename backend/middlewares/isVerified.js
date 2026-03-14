const isVerified = (req, res, next) => {
  try {
    if (!req.userAuth.isVerified) {
      throw new Error("You are not verified");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isVerified;
