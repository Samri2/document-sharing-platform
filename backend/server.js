import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";



// Import routes
import indexRouter from "./routes/indexRoutes.js";

// Import models and association setup
import User from "./models/User.js";
import Folder from "./models/Folder.js";
import File from "./models/File.js";
import Document from "./models/Document.js";
// Ensure associations defined in models/index.js are executed
import "./models/index.js";

dotenv.config();

const app = express();
// Configure CORS to allow the frontend origin and Authorization header
const CLIENT_URL = process.env.CLIENT_URL || "document-sharing-platform-lilac.vercel.app";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', indexRouter)

app.get('/', (req, res) => {
  res.send('Your backend API is running!');
});

// Authenticate DB first
sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB connection failed:", err));

// Sync tables AFTER authentication
// Use a safe sync in development to avoid complex ALTER statements that
// can fail on existing schemas. If you need migrations, run them explicitly.
sequelize.sync()
  .then(() => {
    console.log("Tables synced with DB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("DB sync error:", err));
