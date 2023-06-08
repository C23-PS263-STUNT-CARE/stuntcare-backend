import express from "express";
import { createArticle } from "../controllers/admin/articleController.js";
import { createInfo } from "../controllers/admin/infoController.js";

import { verifyToken } from "../middleware/verifyToken.js";

import { login, register } from "../controllers/admin/authController.js";

const router = express.Router();

/* Authentication and Authorization */
router.post("/api/admin/register", register);
router.post("/api/admin/login", login);

router.post("/articles", createArticle);

router.post("/info", createInfo);

export default router;
