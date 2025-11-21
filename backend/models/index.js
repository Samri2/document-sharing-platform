import User from "./User.js";
import Folder from "./Folder.js";
import File from "./File.js";
import Document from "./Document.js";
import AuditLog from "./AuditLog.js";

// User owns folders & files
User.hasMany(Folder, { foreignKey: "owner_id" });
User.hasMany(File, { foreignKey: "owner_id" });

// Folder can have many documents
Folder.hasMany(Document, { foreignKey: "folder_id" });
Document.belongsTo(Folder, { foreignKey: "folder_id" });

// File can have many documents
File.hasMany(Document, { foreignKey: "file_id" });
Document.belongsTo(File, { foreignKey: "file_id" });

// Audit logs by user
User.hasMany(AuditLog, { foreignKey: "actor_id" });

export { User, Folder, File, Document, AuditLog };
