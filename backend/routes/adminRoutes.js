import { Router } from "express";
import { 
    createUser, 
    getUsers, // Assuming this is defined in adminController
    forcePasswordReset,
    deleteUser,
    toggleUserStatus,
    updateUserRole
} from "../controllers/adminController.js"; 
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js"; // REVISED

const adminRoute = Router();

// 1. Admin creates user
adminRoute.post("/create-user", verifyToken, createUser);

// 2. Admin/Auditor forces password reset
adminRoute.post("/reset-password/:userId", verifyToken, authorizeRole(['admin', 'auditor']), forcePasswordReset);

// 3. Admin gets all users
adminRoute.get("/users", getUsers); // Protected route
//delete users
adminRoute.get("/delete-user", verifyToken, authorizeRole(['admin']), deleteUser);
 // Protected route
adminRoute.patch("/users/:id/status", verifyToken, authorizeRole(["admin"]), toggleUserStatus);
adminRoute.patch("/update-role/:id", verifyToken, updateUserRole);
export default adminRoute;
