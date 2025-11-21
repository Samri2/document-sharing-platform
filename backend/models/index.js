import User from "./User.js";
import Folder from "./Folder.js";
import File from "./File.js";
import Document from "./Document.js";

// Consistent associations using model attribute names (ownerId, folderId, fileId)

// User <-> Folder
User.hasMany(Folder, { foreignKey: "ownerId", as: "folders" });
Folder.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User <-> File
User.hasMany(File, { foreignKey: "ownerId", as: "files" });
File.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// Folder <-> File
Folder.hasMany(File, { foreignKey: "folderId", as: "files" });
File.belongsTo(Folder, { foreignKey: "folderId", as: "folder" });

// Folder <-> Document
Folder.hasMany(Document, { foreignKey: "folderId" });
Document.belongsTo(Folder, { foreignKey: "folderId" });

// File <-> Document
File.hasMany(Document, { foreignKey: "fileId" });
Document.belongsTo(File, { foreignKey: "fileId" });

export { User, Folder, File, Document };
