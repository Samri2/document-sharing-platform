import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const File = sequelize.define(
  "files",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    uniqueStorageKey: { 
      type: DataTypes.STRING, 
      allowNull: false,
      field: "unique_storage_key"
    },
    mimeType: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      field: "mime_type"
    },
    sizeBytes: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      field: "size_bytes"
    },
    ownerId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: "owner_id"
    },
    folderId: { 
      type: DataTypes.INTEGER, 
      defaultValue: null,
      field: "folder_id"
    },
    isDeleted: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false, 
      field: "is_deleted"
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

export default File;
