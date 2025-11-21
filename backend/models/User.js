import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      field: "password_hash" 
    },
    role: { type: DataTypes.STRING, allowNull: false },
    forcePasswordChange: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false,
      field: "force_password_change" 
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true, 
      field: "is_active" 
    },
    createdBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      field: "created_by" 
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

export default User;
