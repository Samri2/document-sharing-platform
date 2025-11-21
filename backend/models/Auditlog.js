import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const AuditLog = sequelize.define("audit_logs", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  timestamp: DataTypes.DATE,
  actor_id: DataTypes.INTEGER,
  target_type: DataTypes.STRING,
  target_id: DataTypes.INTEGER,
  action: DataTypes.STRING,
  details: DataTypes.JSONB
}, {
  timestamps: false
});

export default Auditlog;
