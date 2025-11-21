import bcrypt from "bcryptjs";
import sequelize from "./config/db.js";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();
async function createAdmin() {
  try {
    await sequelize.sync(); // ensure tables exist

    const hashed = await bcrypt.hash("admin123", 10); // choose admin password
    const admin = await User.create({
      email: "admin@audit.com",
      password: hashed,
      role: "admin",
      forcePasswordChange: false, // admin doesn't need to change password
    });

    console.log("✅ Admin created:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createAdmin();
