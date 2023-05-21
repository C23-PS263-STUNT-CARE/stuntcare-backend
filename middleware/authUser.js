import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const adminOnly = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Silakan login terlebih dahulu" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: {
          status: "404 Not Found",
          message: "User tidak ditemukan",
        },
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        error: {
          status: "403 Forbidden",
          message: "Akses terlarang",
        },
      });
    }

    req.email = user.email;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};
