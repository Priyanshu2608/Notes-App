const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]; // Correctly access the header
    const token = authHeader && authHeader.split(" ")[1]; // Extract token if present

    if (!token)  return res.sendStatus(401);
    

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: true, message: "Invalid or expired token" });
        
        req.user = user; // Attach the decoded user payload to req.user
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = {
    authenticateToken,
};
