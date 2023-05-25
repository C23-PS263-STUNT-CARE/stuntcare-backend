import { express } from "../utils/importUtil.js";

import {
  getUsers,
  getUserById,
  login,
  register,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/api/v1/users", verifyToken, getUsers);
router.get("/api/v1/users/:id", verifyToken, getUserById);
router.post("/api/users", register);
router.post("/api/login", login);

export default router;
