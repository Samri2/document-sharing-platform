import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ✅ Verify JWT token (No change)
export const verifyToken = (req, res, next) => {
 const authHeader = req.headers.authorization;
 if (!authHeader || !authHeader.startsWith("Bearer "))
 return res.status(401).json({ message: "No token provided" });

 const token = authHeader.split(" ")[1];
 try {
 // If verification succeeds, req.user now contains { id, role }
const decoded = jwt.verify(token, process.env.JWT_SECRET);
 req.user = decoded; 
    next();
 } catch (err) {
res.status(401).json({ message: "Invalid token", error: err.message });
}
};

// 🌟 REVISION: Flexible Role Authorization
export const authorizeRole = (allowedRoles) => (req, res, next) => {
if (!req.user || !allowedRoles.includes(req.user.role)) {
return res.status(403).json({ 
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}` 
    });
  }
next();
};