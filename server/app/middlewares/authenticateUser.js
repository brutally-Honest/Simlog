const jwt = require("jsonwebtoken");
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = tokenData;
    next();
  } catch (err) {
    res.status(401).json(err);
  }
};
const authorizeUser = (roles)=> (req, res, next) => {
    if (roles.includes(req.user.role)) next();
    else res.status(403).json("Access Forbidden");
  };
// const authorizeUser = (req, res, next) => {
//     if (req.permittedRoles.includes(req.user.role)) next();
//     else res.status(403).json("Access Forbidden");
//   };

module.exports = {
  authenticateUser,
  authorizeUser,
};
