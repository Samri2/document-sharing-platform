import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ===========================
// Admin creates a new user
// ===========================
export const createUser = async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role)
    return res.status(400).json({ message: "Email and role required" });

  try {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await User.create({
      email,
      passwordHash: hashedPassword,      // <-- fixed
      role,
      forcePasswordChange: true,         // <-- fixed
      createdBy: req.user.id,            // <-- fixed
    });

    res.json({
      message: "User created successfully",
      tempPassword,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===========================
// Reset user password
// ===========================
export const forcePasswordReset = async (req, res) => {
  const { userId } = req.params;

  try {
    const userToReset = await User.findByPk(userId);
    if (!userToReset) return res.status(404).json({ message: "User not found" });

    if (userToReset.role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Cannot reset an Admin account." });
    }

    const newTempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(newTempPassword, 10);

    userToReset.passwordHash = hashedPassword;       // <-- fixed
    userToReset.forcePasswordChange = true;         // <-- fixed
    await userToReset.save();

    res.json({
      message: `Password reset for user ${userId}. They must change it on next login.`,
      newTempPassword,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// === Get All Users ===
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "email",
        "role",
        "isActive",             // <-- fixed
        "forcePasswordChange",  // <-- fixed
      ],
    });
    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// === Delete User ===
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
