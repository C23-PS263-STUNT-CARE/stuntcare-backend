import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./userModel.js";

const { DataTypes } = Sequelize;

const Stunting = db.define(
  "stunting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    sex: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.FLOAT,
    },
    birth_weight: {
      type: DataTypes.FLOAT,
    },
    birth_length: {
      type: DataTypes.FLOAT,
    },
    body_weight: {
      type: DataTypes.FLOAT,
    },
    body_length: {
      type: DataTypes.FLOAT,
    },
    asi_eksklusif: {
      type: DataTypes.STRING,
    },
    status_stunting: {
      type: DataTypes.FLOAT,
    },
    user_id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Stunting.belongsTo(User, { foreignKey: "user_id" });

export default Stunting;

(async () => {
  await db.sync();
})();
