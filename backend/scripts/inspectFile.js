import sequelize from "../config/db.js";
import File from "../models/File.js";
import "../models/index.js";

const id = process.argv[2] || 5;

const run = async () => {
  try {
    await sequelize.authenticate();
    const file = await File.findByPk(id);
    if (!file) {
      console.log(`File ${id} not found`);
    } else {
      console.log(file.toJSON());
    }
    process.exit(0);
  } catch (err) {
    console.error('Inspect error:', err);
    process.exit(1);
  }
};

run();
