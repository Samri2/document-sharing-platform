import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// ===========================
// LOGIN
// ===========================
export const login = async (req, res) => {
  const { email, password } = req.body;

console.log("Received login request for:", email);
  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Critical check: Ensure the password hash is present before comparing
    if (!user.password) {
        console.error(`User ${email} found, but password hash is null or empty.`);
        return res.status(500).json({ message: "Internal user data error." });
    }
    
    // Check password - This is the most likely line to throw an error 
    // if the hash is malformed (e.g., has extra spaces).
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Check if user is active (Soft Delete)
    if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive. Please contact administrator." });
    }

    // Check if user must change password
    if (user.forcePasswordChange) {
      return res.status(200).json({
        forcePasswordChange: true,
        email: user.email,
      });
    }

    // Normal login → generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    // ✨ CRITICAL FIX: Log the full error stack to the terminal
    console.error("LOGIN FAILED (Server stack trace):", err.stack); 
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// CHANGE PASSWORD
// ===========================
export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res
      .status(400)
      .json({ message: "Email & new password required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.forcePasswordChange = false; // password updated, no longer forced
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    // ✨ CRITICAL FIX: Log the full error stack to the terminal
    console.error("CHANGE PASSWORD FAILED (Server Error):", err.stack); 
    res.status(500).json({ message: "Server error", error: err.message });
  }
};