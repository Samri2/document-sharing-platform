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

export default router;

