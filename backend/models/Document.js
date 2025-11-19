import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Document = sequelize.define("Document", {
  name: { type: DataTypes.STRING, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: false },
  uploadedBy: { type: DataTypes.STRING, allowNull: true },
});

export default Document;
