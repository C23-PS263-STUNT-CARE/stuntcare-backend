import { express } from "../utils/importUtil.js";
import { verifyToken } from "../middleware/verifyToken.js";

import { login, register } from "../controllers/user/authController.js";

import {
  cekStunting,
  getAllStuntingByUserId,
  historyStuntingById,
} from "../controllers/user/stuntingController.js";

import {
  getArticleById,
  getArticles,
} from "../controllers/user/articleController.js";

import { getInfo } from "../controllers/user/infoController.js";

const router = express.Router();

/* Authentication and Authorization */
router.post("/api/register", register);
router.post("/api/login", login);

/* Article */
router.get("/api/v1/articles", verifyToken, getArticles);
router.get("/api/v1/articles/:articleId", verifyToken, getArticleById);

/* Info */
router.get("/api/v1/info", verifyToken, getInfo);

/* Stunting */
router.post("/api/v1/ceknt/:userId", cekStunting);
router.get("/api/v1/historynt/:userId", getAllStuntingByUserId);
router.get("/api/v1/historynt/:stuntingId", historyStuntingById);

/* Stunting */
router.post("/api/v1/cek/:userId", verifyToken, cekStunting);
router.get("/api/v1/history/:userId", verifyToken, getAllStuntingByUserId);
router.get("/api/v1/history/:stuntingId", verifyToken, historyStuntingById);

export default router;
