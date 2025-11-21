// adminController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ===========================
// Create User
// ===========================
export const createUser = async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) return res.status(400).json({ message: "Email and role required" });

  try {
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await User.create({
      email,
      passwordHash: hashedPassword,          // matches User model
      role,
      forcePasswordChange: true,
      createdBy: req.user.id,                // matches User model
    });

    res.json({
      message: "User created successfully",
      tempPassword,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    console.error("Create user failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// Force Password Reset
// ===========================
export const forcePasswordReset = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Cannot reset Admin account" });
    }

    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    user.passwordHash = hashedPassword;
    user.forcePasswordChange = true;
    await user.save();

    res.json({
      message: `Password reset for user ${userId}`,
      newTempPassword: tempPassword,
    });
  } catch (err) {
    console.error("Password reset failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// Get Users
// ===========================
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role", "isActive", "forcePasswordChange"],
    });
    res.json({ users });
  } catch (err) {
    console.error("Get users failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// Delete User
// ===========================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//update roles
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role: newRole } = req.body;

  if (!newRole) {
    return res.status(400).json({ message: "New role is required" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = newRole;
    await user.save();

    res.json({ message: "Role updated successfully", user });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};