import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Folder = sequelize.define(
  "folders",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    parentFolderId: { 
      type: DataTypes.INTEGER, 
      field: "parent_folder_id", 
      defaultValue: null 
    },
    ownerId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      field: "owner_id"
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

export default Folder;
