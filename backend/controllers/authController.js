// authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// ===========================
// Login
// ===========================
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.passwordHash) {
      console.error(`User ${email} has null password hash`);
      return res.status(500).json({ message: "Internal user data error" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isActive) return res.status(401).json({ message: "Account inactive" });

    if (user.forcePasswordChange) {
      return res.status(200).json({ forcePasswordChange: true, email: user.email });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// Change Password
// ===========================
export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: "Email & new password required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    user.forcePasswordChange = false;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
