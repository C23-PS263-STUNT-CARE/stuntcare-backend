import { express } from "../utils/importUtil.js";
import { verifyToken } from "../middleware/verifyToken.js";

import { login, register } from "../controllers/user/authController.js";

import {
  getArticles,
  getLatestArticles,
} from "../controllers/user/articleController.js";
import { createToddler } from "../controllers/user/toddlerController.js";
import {
  cekStunting,
  historyStunting,
  statusStunting,
} from "../controllers/user/stuntingController.js";

const router = express.Router();

/* Authentication and Authorization */
router.post("/api/register", register);
router.post("/api/login", login);

/* Article */
router.get("/api/v1/articles", verifyToken, getArticles);
router.get("/api/v1/articles/latest", verifyToken, getLatestArticles);

/* Toddler */
router.post("/toddlers/:userId", verifyToken, createToddler);

/* Stunting */
router.post("/cek/:userId/:toddlerId", verifyToken, cekStunting);
router.get("/status/:userId/:toddlerId", verifyToken, statusStunting);
router.get("/history/:userId/:toddlerId", verifyToken, historyStunting);

export default router;
