import User from "./User.js";
import Folder from "./Folder.js";
import File from "./File.js";
import Document from "./Document.js";
// import AuditLog from "./AuditLog.js"; // NOT USED — leave commented

// ============================
// USER RELATIONSHIPS
// ============================

// A user owns many folders
User.hasMany(Folder, { foreignKey: "owner_id" });
Folder.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

// A user owns many files
User.hasMany(File, { foreignKey: "owner_id" });
File.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

// ============================
// FOLDER ↔ DOCUMENT
// ============================

Folder.hasMany(Document, { foreignKey: "folder_id" });
Document.belongsTo(Folder, { foreignKey: "folder_id" });

// ============================
// FILE ↔ DOCUMENT
// ============================

File.hasMany(Document, { foreignKey: "file_id" });
Document.belongsTo(File, { foreignKey: "file_id" });

// Folder can have many files
Folder.hasMany(File, { foreignKey: "folder_id", as: "files" });
File.belongsTo(Folder, { foreignKey: "folder_id", as: "folder" });



// User <-> Folder
User.hasMany(Folder, { foreignKey: "ownerId", as: "folders" });
Folder.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User <-> File
User.hasMany(File, { foreignKey: "ownerId", as: "files" });
File.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// ============================
// EXPORT ONLY EXISTING MODELS
// ============================
export { User, Folder, File, Document };
