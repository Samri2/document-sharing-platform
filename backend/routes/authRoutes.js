import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { login, changePassword } from "../controllers/authController.js";
const authRoute = Router();



// 1. LOGIN ROUTE: Now correctly points to the external, revised login controller function
authRoute.post("/login", login); 

// 2. CHANGE PASSWORD ROUTE
authRoute.post("/change-password", changePassword);

export default authRoute;

