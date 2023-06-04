import express from "express";
import {
  createArticle,
  deleteArticle,
} from "../controllers/admin/articleController.js";

const router = express.Router();

router.post("/articles", createArticle);
router.delete("/articles/:id", deleteArticle);

export default router;
