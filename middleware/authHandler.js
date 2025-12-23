const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer"))
    return res.status(401).json({ message: "Unauthorised: no token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Forbidden: invalid or expired token" });

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: `Unauthorised: ${role} not allowed` });
  next();
};
