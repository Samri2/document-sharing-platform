import express from "express";
import {
  upload,
  uploadFile,
  getAllDocuments,
  createFolder,
  deleteFile,
  deleteFolder,
  downloadFile
} from "../controllers/docController.js";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js"; 
const router = express.Router();

// Use the middleware in the route
router.post("/upload", verifyToken, upload.single('file'), uploadFile);
// === Folder Routes ===
router.post("/create-folder", verifyToken, authorizeRole(['admin']), createFolder);
router.delete("/delete-folder/:id", verifyToken, authorizeRole(['admin']), deleteFolder);

// === File Routes ===
router.post("/upload", verifyToken, authorizeRole(['admin']), upload.single("file"), uploadFile);
router.delete("/delete-file/:id", verifyToken, authorizeRole(['admin']), deleteFile);
router.get("/download/:id", downloadFile);

// === Fetch All Folders + Files ===
router.get("/", verifyToken, getAllDocuments); // This route remains the same
export default router;
