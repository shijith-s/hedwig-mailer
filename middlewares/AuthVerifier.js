const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  const jwtToken = req.headers["authorization"].split(" ")[1];
  jwt.verify(jwtToken, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(400).json({message:"token is not valid"});
    }
    req.userID = payload._id;
    next();
  });
};

module.exports = verifyAuth;
