import { express } from "../utils/importUtil.js";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  getUsers,
  getUserById,
  login,
  register,
} from "../controllers/user/authController.js";

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
router.get("/api/v1/users", verifyToken, getUsers);
router.get("/api/v1/users/:id", verifyToken, getUserById);
router.post("/api/register", register);
router.post("/api/login", login);

/* Article */
router.get("/api/v1/articles", getArticles);
router.get("/api/v1/articles/latest", getLatestArticles);

/* Toddler */
router.post("/toddlers/:userId", verifyToken, createToddler);

/* Stunting */
router.post("/cek/:userId/:toddlerId", verifyToken, cekStunting);
router.get("/status/:userId/:toddlerId", verifyToken, statusStunting);
router.get("/history/:userId/:toddlerId", verifyToken, historyStunting);

export default router;
