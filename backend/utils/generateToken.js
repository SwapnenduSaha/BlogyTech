const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
  return token;
};

module.exports = generateToken;
