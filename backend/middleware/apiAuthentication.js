const jwt = require("jsonwebtoken");


// Generating JWT Token
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
};


// Verifying JWT Token
const validateToken = (req, res, next) => {

  try {

    // Checking Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token not present",
      });
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Attach User to Request
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(403).json({
      message: "Invalid Token",
    });

  }
};


// Validate Logged In User
const validateUser = (user, emailId) => {

  if (user !== emailId) {

    const err = new Error("Access Denied");
    err.status = 403;

    throw err;
  }

  return true;
};


module.exports = {
  generateAccessToken,
  validateToken,
  validateUser,
};