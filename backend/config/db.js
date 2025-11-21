import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // important for Render
    },
  },
});
sequelize.authenticate()
  .then(() => console.log("🔥 DB Connected Successfully"))
  .catch(err => console.error("❌ DB Connection Error:", err));

export default sequelize;
