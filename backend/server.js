import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

// Import models here
import User from "./models/User.js";
import Folder from "./models/Folder.js";
import File from "./models/File.js";
import Document from "./models/Document.js";
//import AuditLog from "./models/Auditlog.js";//

// Import routes
import docRoutes from "./routes/docRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Your backend API is running!');
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/documents", docRoutes);

// Authenticate DB first
sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB connection failed:", err));

// Sync tables AFTER authentication
sequelize.sync({ alter: true }) // This updates tables to match models
  .then(() => {
    console.log("Tables synced with DB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("DB sync error:", err));
