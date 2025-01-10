const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: true, message: "Token missing" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: true, message: "Invalid or expired token" });

    req.user = user;
    console.log("Authenticated user:", user); // Debug log
    next();
  });
}

module.exports = { authenticateToken };
