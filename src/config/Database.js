import { Sequelize } from "sequelize";

import dotenv from "dotenv";

dotenv.config(); // Mengimpor variabel lingkungan dari file .env

const db = new Sequelize(
  process.env.DB_TABLE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_URL,
    dialect: "mysql",
    logging: false,
  }
);

export default db;
