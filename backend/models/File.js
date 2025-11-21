import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const File = sequelize.define("files", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  unique_storage_key: DataTypes.STRING,
  mime_type: DataTypes.STRING,
  size_bytes: DataTypes.BIGINT,
  owner_id: DataTypes.INTEGER,
  is_deleted: DataTypes.BOOLEAN,
  created_at: DataTypes.DATE
}, {
  timestamps: false
});

export default File;
