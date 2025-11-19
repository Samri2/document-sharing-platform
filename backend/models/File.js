import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Folder from "./Folder.js";

const File = sequelize.define("File", {
  title: { type: DataTypes.STRING, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: false },
  uploadedBy: { type: DataTypes.STRING },
});

// Relations
Folder.hasMany(File, { as: "files", foreignKey: "folderId" });
File.belongsTo(Folder, { foreignKey: "folderId" });

export default File;
