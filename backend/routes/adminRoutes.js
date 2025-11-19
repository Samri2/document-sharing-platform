import express from "express";
import { 
    createUser, 
    getUsers, // Assuming this is defined in adminController
    forcePasswordReset 
} from "../controllers/adminController.js"; 
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js"; // REVISED

const router = express.Router();

// 1. Admin creates user
router.post("/create-user", verifyToken, authorizeRole(['admin']), createUser);

// 2. Admin/Auditor forces password reset
router.post("/reset-password/:userId", verifyToken, authorizeRole(['admin', 'auditor']), forcePasswordReset);

// 3. Admin gets all users
router.get("/users", verifyToken, authorizeRole(['admin']), getUsers); // Protected route

export default router;