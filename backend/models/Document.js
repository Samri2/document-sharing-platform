import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Folder from "./Folder.js";
import File from "./File.js";

const Document = sequelize.define(
  "documents",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    folderId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      field: "folder_id" 
    },

    fileId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      field: "file_id" 
    },

    createdAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW,
      field: "created_at" 
    }
  },
  {
    timestamps: false
  }
);

// 🔗 Associations
Document.belongsTo(Folder, { foreignKey: "folder_id", as: "folder" });
Document.belongsTo(File, { foreignKey: "file_id", as: "file" });

export default Document;
