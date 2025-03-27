import jwt from "jsonwebtoken";
import Config from "../config.js";

function userMiddleware(req, res, next) {
  // check if token is provided
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  // extract token from authorization header
  const token = authHeader.split(" ")[1];
  // validate token
  try {
    const decoded = jwt.verify(token, Config.JWT_SECRET);
    console.log(decoded);
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("Invalid token or expired token:" + error);
    return res.status(401).json({ errors: "Invalid token or expired tooken" });
  }
}
export default userMiddleware;
