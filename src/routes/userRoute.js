import { express } from "../utils/importUtil.js";
import { verifyToken } from "../middleware/verifyToken.js";

import { login, register } from "../controllers/user/authController.js";

import {
  getArticleById,
  getArticles,
  getLatestArticles,
} from "../controllers/user/articleController.js";
import {
  cekStunting,
  getAllStuntingByUserId,
  historyStuntingById,
} from "../controllers/user/stuntingController.js";

const router = express.Router();

/* Authentication and Authorization */
router.post("/api/register", register);
router.post("/api/login", login);

/* Article */
router.get("/api/v1/articles", getArticles);
router.get("/api/v1/articles/:articleId", getArticleById);
router.get("/api/v1/articles/latest", getLatestArticles);

/* Stunting */
router.post("/api/v1/cek/:userId", cekStunting);
router.get("/api/v1/history/:userId", getAllStuntingByUserId);
router.get("/api/v1/history/:stuntingId", historyStuntingById);

export default router;
