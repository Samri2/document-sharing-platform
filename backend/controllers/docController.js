import fs from "fs";
import path from "path";
import multer from "multer";
import Folder from "../models/Folder.js";
import File from "../models/File.js";
import User from "../models/User.js";

// --- 1. Ensure upload folder exists ---
const uploadPath = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// --- 2. Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });

// --- 3. Admin: Create Folder ---
export const createFolder = async (req, res) => {
  const { name, parentFolderId } = req.body;
  const userId = req.user.id;

  if (!name) return res.status(400).json({ message: "Folder name required" });

  try {
    const folder = await Folder.create({
      name,
      parentFolderId: parentFolderId || null,
      ownerId: userId,
      isDeleted: false,
    });

    res.json({ message: "Folder created", folder });
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- 4. Admin: Upload File ---
export const uploadFile = async (req, res) => {
  const { folderId } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "File required" });

  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    // Only admin or folder owner can upload
    if (folder.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const newFile = await File.create({
      title: file.originalname,
      uniqueStorageKey: file.path,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      ownerId: req.user.id,
      folderId: folder.id,
      isDeleted: false,
    });

    res.status(201).json({ message: "File uploaded", file: newFile });
  } catch (err) {
    console.error("Upload file error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- 5. Users: View Folders & Files ---
export const getAllDocuments = async (req, res) => {
  try {
    const folders = await Folder.findAll({
      where: { isDeleted: false },
      include: [
        { model: File, as: "files", where: { isDeleted: false }, required: false },
        { model: User, as: "owner", attributes: ["email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Map to frontend format
    const result = folders.map((f) => ({
      id: f.id,
      name: f.name,
      type: "folder",
      owner: f.owner,
      createdAt: f.createdAt,
      files: f.files.map(file => ({
        id: file.id,
        title: file.title,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        createdAt: file.createdAt,
      })),
    }));

    res.json({ folders: result });
  } catch (err) {
    console.error("Fetch folders/files failed:", err);
    res.status(500).json({ message: "Failed to fetch folders", error: err.message });
  }
};
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const isAuthorized = file.ownerId === req.user.id || req.user.role === "admin";
    if (!isAuthorized) return res.status(403).json({ message: "Access denied" });

    file.isDeleted = true;
    await file.save();

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete file failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findByPk(req.params.id, { include: [{ model: File }] });
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const isAuthorized = folder.ownerId === req.user.id || req.user.role === "admin";
    if (!isAuthorized) return res.status(403).json({ message: "Access denied" });

    folder.isDeleted = true;
    await folder.save();

    for (const file of folder.Files || []) {
      file.isDeleted = true;
      await file.save();
    }

    res.json({ message: "Folder and its contents deleted successfully" });
  } catch (err) {
    console.error("Delete folder failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Download file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Ensure the stored path actually exists on this server before attempting download
    const filePath = file.uniqueStorageKey;
    // If the stored path doesn't exist on this host, attempt a fallback
    if (!filePath || !fs.existsSync(filePath)) {
      const fallback = path.join(uploadPath, path.basename(filePath || ""));
      if (fallback && fs.existsSync(fallback)) {
        console.warn(`Using fallback path for download: ${fallback}`);
        return res.download(fallback, file.title);
      }

      console.error(`Download failed - path not found: ${filePath}`);
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, file.title);
  } catch (err) {
    console.error("File download error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// ===========================
export const getDocuments = async (req, res) => {
  try {
    // Fetch all folders with their associated files
    const folders = await Folder.findAll({
      include: [
        {
          model: File,
          as: "files", // this must match your Sequelize association
          attributes: ["id", "title", "createdAt", "owner_id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ folders });
  } catch (err) {
    console.error("Fetch folders/files failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
