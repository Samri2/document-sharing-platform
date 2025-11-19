import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js"; // your sequelize instance
import User from "./models/User.js";
import Document from "./models/Document.js";
import docRoutes from "./routes/docRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/documents", docRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB connection failed:", err));
  sequelize.sync({ alter: true }) // will update tables to match models
  .then(() => console.log("Tables synced with DB"))
  .catch((err) => console.error("DB sync error:", err));