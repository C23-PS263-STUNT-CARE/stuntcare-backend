import express from "express";
import { createArticle } from "../controllers/admin/articleController.js";
import { createInfo } from "../controllers/admin/infoController.js";

import { verifyToken } from "../middleware/verifyToken.js";

import { login, register } from "../controllers/admin/authController.js";

const router = express.Router();

/* Authentication and Authorization */
router.post("/admin/register", register);
router.post("/admin/login", login);

router.post("/articles", verifyToken, createArticle);

router.post("/info", verifyToken, createInfo);

export default router;
