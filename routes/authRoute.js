import express from "express";
import {
  getUsers,
  login,
  register,
  logout,
} from "../controllers/authController.js";
import { refreshToken } from "../controllers/refreshToken.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", register);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

export default router;
