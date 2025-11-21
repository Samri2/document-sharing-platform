import fs from "fs";
import path from "path";
import multer from "multer";
import Folder from "../models/Folder.js"; 
import File from "../models/file.js"; 

// --- 1. File Upload Setup (Multer) ---

// Define the local directory for storage (insecure for production, but kept for development setup)
const uploadPath = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Use a secure, unique name in production (e.g., UUIDs)
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

// Export the configured Multer middleware
export const upload = multer({ storage });


// --- 2. Folder Management (CRUD) ---

// Create a new Folder
export const createFolder = async (req, res) => {
    // req.user.id is available from the verifyToken middleware
    const { name, parentFolderId } = req.body;
    if (!name) return res.status(400).json({ message: "Folder name required" });

    try {
        const folder = await Folder.create({ 
            name, 
            ownerId: req.user.id, // 🔑 Set the owner ID from the JWT payload
            parentFolderId: parentFolderId || null 
        });
        res.status(201).json({ folder });
    } catch (err) {
        console.error("Create folder error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Soft Delete a Folder (and its contents)
export const deleteFolder = async (req, res) => {
    try {
        // Fetch the folder and its files for cascading soft delete
        const folder = await Folder.findByPk(req.params.id, {
          include: [{ model: File, as: "files" }],
        });
        if (!folder) return res.status(404).json({ message: "Folder not found" });

        // 🔑 Authorization: Must be the folder owner OR an Admin
        const isAuthorized = folder.ownerId === req.user.id || req.user.role === 'admin';
        if (!isAuthorized) {
            return res.status(403).json({ message: "Access denied. Not authorized to delete this folder." });
        }
        
        // Soft delete the folder
        folder.isDeleted = true;
        await folder.save();

        // Soft delete all contained files
        for (const file of folder.files) {
             file.isDeleted = true;
             await file.save();
        }

        res.json({ message: "Folder and its contents marked as deleted successfully" });
    } catch (err) {
        console.error("Delete folder error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// --- 3. File Management (Upload & Delete) ---

// Upload a new File
export const uploadFile = async (req, res) => {
    const { folderId } = req.body;
    const file = req.file; // File object provided by Multer

    if (!file) return res.status(400).json({ message: "File required" });

    try {
        const folder = await Folder.findByPk(folderId);
        if (!folder) return res.status(404).json({ message: "Folder not found" });
        
        // 🔑 Authorization: Check if user is authorized to upload to this folder
        const isAuthorized = folder.ownerId === req.user.id || req.user.role === 'admin';
        if (!isAuthorized) {
             return res.status(403).json({ message: "Access denied. Cannot upload to this folder." });
        }

        const newFile = await File.create({
          title: file.originalname,
          path: file.path, // In a real app, this should be the S3/GCS unique_storage_key
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

// Soft Delete a File
export const deleteFile = async (req, res) => {
    try {
        const file = await File.findByPk(req.params.id);
        if (!file) return res.status(404).json({ message: "File not found" });

        // 🔑 Authorization: Must be the file owner OR an Admin
        const isAuthorized = file.ownerId === req.user.id || req.user.role === 'admin';
        if (!isAuthorized) {
            return res.status(403).json({ message: "Access denied. Not authorized to delete this file." });
        }
        
        // Soft delete the file
        file.isDeleted = true;
        await file.save();

        res.json({ message: "File marked as deleted successfully" });
    } catch (err) {
        console.error("Delete file error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// --- 4. Fetching Documents ---

// Get all Folders and their Files (filtered by owner and soft delete status)
export const getAllDocuments = async (req, res) => {
    try {
        // ✨ FIX: Simplified logic. Both roles see everything.
        // We just filter out deleted items.
        let folderWhereClause = { isDeleted: false }; 
        
        const folders = await Folder.findAll({
          where: folderWhereClause, 
          include: [{ 
            model: File, 
            as: "files",
            where: { isDeleted: false }, 
            required: false 
          }],
        });

        res.json({ folders });
    } catch (err) {
        console.error("Get documents error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }

};