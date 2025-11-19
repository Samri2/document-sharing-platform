import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { login, changePassword } from "../controllers/authController.js";
const router = express.Router();



// 1. LOGIN ROUTE: Now correctly points to the external, revised login controller function
router.post("/login", login); 

// 2. CHANGE PASSWORD ROUTE
router.post("/change-password", changePassword);

// 3. GET USERS EXPORT: This function should NOT be here. It should be in adminRoutes.js. 
// However, to make this file functional, we will remove the export and keep the router clean.

export default router;

// NOTE: The getUsers function was removed from this file's export/definition, 
// as its purpose is for the admin panel and should be defined in a separate file (e.g., adminController.js) 
// and used in adminRoutes.js.