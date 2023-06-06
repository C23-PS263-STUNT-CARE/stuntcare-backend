import express from "express";
import {
  createArticle,
  deleteArticle,
} from "../controllers/admin/articleController.js";
import { createInfo } from "../controllers/admin/infoController.js";

const router = express.Router();

router.post("/articles", createArticle);
router.delete("/articles/:id", deleteArticle);

router.post("/info", createInfo);

export default router;
