const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    console.log("Incoming Headers:", req.headers); // Debugging: Log headers

    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn("Access Denied: No Token Provided"); // Log warning
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified User:", verified); // Debugging: Log verified user
        req.user = verified; // Attach user info to request object
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message); // Log JWT errors
        return res.status(400).json({ message: "Invalid Token" });
    }
};
