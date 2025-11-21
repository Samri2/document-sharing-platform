import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Folder = sequelize.define("folders", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  parent_folder_id: DataTypes.INTEGER,
  owner_id: DataTypes.INTEGER,
  is_deleted: DataTypes.BOOLEAN,
  created_at: DataTypes.DATE
}, {
  timestamps: false
});

export default Folder;
