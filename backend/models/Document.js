import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Document = sequelize.define("documents", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  folder_id: DataTypes.INTEGER,
  file_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, {
  timestamps: false
});

export default Document;
