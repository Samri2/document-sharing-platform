// documentController.js (folders & files)
import fs from "fs";
import path from "path";
import multer from "multer";
import Folder from "../models/Folder.js";
import File from "../models/File.js";
import User from "../models/User.js";

// --- File Upload Setup ---
const uploadPath = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

export const upload = multer({ storage });

// --- Folder CRUD ---
export const createFolder = async (req, res) => {
  const { name, parentFolderId } = req.body;
  const userId = req.user.id;
  if (!name) return res.status(400).json({ message: "Folder name required" });

  try {
    const folder = await Folder.create({
      name,
      parentFolderId: parentFolderId || null,
      ownerId: userId,
      isDeleted: false
    });
    res.json({ folder });
  } catch (err) {
    console.error("Create folder failed:", err);
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

// --- File CRUD ---
export const uploadFile = async (req, res) => {
  const { folderId } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ message: "File required" });

  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const isAuthorized = folder.ownerId === req.user.id || req.user.role === "admin";
    if (!isAuthorized) return res.status(403).json({ message: "Access denied" });

    const newFile = await File.create({
      title: file.originalname,
      uniqueStorageKey: file.path,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      ownerId: req.user.id,
      folderId: folder.id,
      isDeleted: false
    });

    res.status(201).json({ message: "File uploaded", file: newFile });
  } catch (err) {
    console.error("Upload file failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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

// --- Fetch folders with owner ---
export const getAllDocuments = async (req, res) => {
  try {
    const folders = await Folder.findAll({
      where: { isDeleted: false },
      include: [{ model: User, as: "owner", attributes: ["email"] }],
      order: [["createdAt", "DESC"]],
    });

    const result = folders.map(f => ({
      id: f.id,
      name: f.name,
      type: "folder",
      owner: f.owner,
      createdAt: f.createdAt
    }));

    res.json({ folders: result });
  } catch (err) {
    console.error("Fetch folders failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
