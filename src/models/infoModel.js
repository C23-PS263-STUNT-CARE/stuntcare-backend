import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Admin from "./adminModel.js";

const { DataTypes } = Sequelize;

const Info = db.define(
  "info",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_url: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Info;

(async () => {
  await db.sync();
})();
