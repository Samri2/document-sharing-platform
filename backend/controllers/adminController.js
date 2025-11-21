import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ===========================
// Create new user (Admin only)
// ===========================
export const createUser = async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role)
    return res.status(400).json({ message: "Email and role required" });

  try {
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      role,
      force_password_change: true,  // force password change on first login
      is_active: true,              // default active
      created_by: req.user.id,      // admin who created
      created_at: new Date(),       // timestamp
    });

    res.status(201).json({
      message: "User created successfully",
      tempPassword, 
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// Force password reset
// ===========================
export const forcePasswordReset = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: prevent non-admins from resetting admin passwords
    if (user.role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Cannot reset Admin account" });
    }

    const tempPassword = Math.random().toString(36).slice(-10);
    user.password_hash = await bcrypt.hash(tempPassword, 10);
    user.force_password_change = true;
    await user.save();

    res.json({
      message: `Password reset for user ${userId}. Must change on next login.`,
      tempPassword,
    });
  } catch (err) {
    console.error("Force password reset error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// Get all users (Admin only)
// ===========================
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "email",
        "role",
        "is_active",
        "force_password_change",
      ],
    });
    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// Delete a single user
// ===========================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
