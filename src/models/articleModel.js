import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Article = db.define(
  "article",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    excerpt: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
    tag: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Article;

(async () => {
  await db.sync();
})();
