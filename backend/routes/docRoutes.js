import { Router } from "express";
import {
  upload,
  uploadFile,
  getAllDocuments,
  createFolder,
  deleteFile,
  deleteFolder,
  downloadFile,
  getDocuments,
} from "../controllers/docController.js";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js";

const docRouter = Router();

// === File Upload (admin only) ===
docRouter.post(
  "/upload",
  verifyToken,
  authorizeRole(["admin"]),
  upload.single("file"),
  uploadFile
);

// === Folder Routes (admin) ===
docRouter.post("/create-folder", verifyToken, authorizeRole(["admin"]), createFolder);
docRouter.delete("/delete-folder/:id", verifyToken, authorizeRole(["admin"]), deleteFolder);

// === File Routes (admin) ===
docRouter.delete("/delete-file/:id", verifyToken, authorizeRole(["admin"]), deleteFile);
docRouter.get("/download/:id", verifyToken, downloadFile);

// === Fetch All Folders + Files ===
// Public lightweight endpoint
docRouter.get("/", getDocuments);
// Authenticated endpoint with richer formatting (used by frontend when logged-in)
docRouter.get("/getAllDocuments", verifyToken, getAllDocuments);

export default docRouter;
