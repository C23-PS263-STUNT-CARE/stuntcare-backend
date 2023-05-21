import express from "express";
import {
  getUsers,
  login,
  register,
  logout,
} from "../controllers/authController.js";
import { refreshToken } from "../controllers/refreshToken.js";
import { adminOnly } from "../middleware/authUser.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  loginValidator,
  registerValidator,
  runValidation,
} from "../validation/authValidation.js";

const router = express.Router();

router.get("/users", verifyToken, adminOnly, getUsers);
router.post("/users", registerValidator, runValidation, register);
router.post("/login", loginValidator, runValidation, login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

export default router;
