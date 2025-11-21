import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password_hash: DataTypes.STRING,
  role: DataTypes.STRING,
  force_password_change: DataTypes.BOOLEAN,
  is_active: DataTypes.BOOLEAN,
  created_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, {
  timestamps: false
});

export default User;
