import { express } from "../utils/importUtil.js";
import { verifyToken } from "../middleware/verifyToken.js";

import { login, register } from "../controllers/user/authController.js";

import {
  cekStunting,
  deleteStuntingById,
  editStuntingById,
  getAllStuntingByUserId,
  getStuntingById,
} from "../controllers/user/stuntingController.js";

import {
  getArticleById,
  getArticles,
  getPinnedArticle,
} from "../controllers/user/articleController.js";

import { getInfo } from "../controllers/user/infoController.js";

const router = express.Router();

/* Authentication and Authorization */
router.post("/api/register", register);
router.post("/api/login", login);

/* Article */
router.get("/api/v1/pinArticle", verifyToken, getPinnedArticle);
router.get("/api/v1/articles", verifyToken, getArticles);
router.get("/api/v1/articles/:articleId", verifyToken, getArticleById);

/* Info */
router.get("/api/v1/info", verifyToken, getInfo);

/* Stunting */
router.post("/api/v1/cek/:userId", verifyToken, cekStunting);
router.get("/api/v1/history/:userId", verifyToken, getAllStuntingByUserId);
router.get(
  "/api/v1/stunting/:userId/:stuntingId",
  verifyToken,
  getStuntingById
);
router.put(
  "/api/v1/stunting/:userId/:stuntingId",
  verifyToken,
  editStuntingById
);
router.delete(
  "/api/v1/stunting/:userId/:stuntingId",
  verifyToken,
  deleteStuntingById
);

export default router;
