import bcrypt from "bcryptjs";
import sequelize from "./config/db.js";
import User from "./models/User.js";

async function seed() {
  await sequelize.sync({ force: true }); // clears & rebuilds tables

  const hashedAdmin = await bcrypt.hash("admin123", 10);
  const hashedUser = await bcrypt.hash("auditor123", 10);

  await User.bulkCreate([
    { email: "admin@audit.com", password: hashedAdmin, role: "admin" },
    { email: "auditor@audit.com", password: hashedUser, role: "auditor" },
  ]);

  console.log("✅ Seed completed!");
  process.exit();
}

seed();
