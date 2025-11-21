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

    if (!user.password_hash) {
      console.error(`User ${email} found, but password_hash is null.`);
      return res.status(500).json({ message: "Internal user data error." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.is_active) {
      return res.status(401).json({ message: "Account inactive. Contact admin." });
    }

    if (user.force_password_change) {
      return res.status(200).json({
        forcePasswordChange: true,
        email: user.email,
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("LOGIN FAILED:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// CHANGE PASSWORD
// ===========================
export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({ message: "Email & new password required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashed;
    user.force_password_change = false;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD FAILED:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
