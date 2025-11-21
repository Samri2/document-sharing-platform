import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ===========================
// Admin creates a new user (MINOR REVISION: Use req.user.id for 'created_by')
// ===========================
export const createUser = async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role)
    return res.status(400).json({ message: "Email and role required" });

  try {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 🌟 REVISION: If you had a 'created_by' field in the User model,
    // you would set it to req.user.id here.
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      role,
      force_Password_Change: true, // force password change on first login
       createdBy: req.user.id, // Assuming req.user.id is available from verifyToken
    });

    // ... response code (No changes) ...
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

// 🌟 NEW: Auditor/Admin resets another user's password
export const forcePasswordReset = async (req, res) => {
    // Note: This route will be protected by authorizeRole(['admin', 'auditor'])
    const { userId } = req.params; 

    try {
        const userToReset = await User.findByPk(userId);
        if (!userToReset) return res.status(404).json({ message: "User not found" });

        // Ensure Admins/Auditors cannot reset other Admins (optional security layer)
        if (userToReset.role === 'admin' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Cannot reset an Admin account." });
        }

        const newTempPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(newTempPassword, 10);

        userToReset.password_hash = hashedPassword;
        userToReset.forcePasswordChange = true; // 🔑 KEY LOGIC: Force immediate change
        await userToReset.save();

        // 📝 In a real app, log this action in an audit table here.
        
        res.json({
            message: `Password reset for user ${userId}. They must change it on next login.`,
            newTempPassword, // Return to Auditor/Admin who initiated the reset
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ... add delete/edit user functions here using User.findByPk and user.destroy()/user.save() ...
// backend/controllers/adminController.js (Ensure this is present)

// ... (Your other imports and functions like createUser, forcePasswordReset)


// === Get All Users (Admin-Only) ===
export const getUsers = async (req, res) => {
    try {
        // Find all users, but only select safe, non-sensitive fields
        const users = await User.findAll({
            attributes: [
                "id", 
                "email", 
                "role", 
                "is_active", // Show if the user is active (soft delete status)
                "force_password_change" // Show if the user must reset their password
            ], 
        });
        res.json({ users });
    } catch (err) {
        console.error("Get users error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
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
