import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access token required" });
  console.log("first", token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log("first", err);

    // if (err) return res.status(403).json({ message: "Invalid or expired access token" });
    if (err) return res.status(403).json({ message: "Please retry in 1 secs" });
    req.user = user; // Attach user info to request
    next();
  });
};

export default verifyJWT;
