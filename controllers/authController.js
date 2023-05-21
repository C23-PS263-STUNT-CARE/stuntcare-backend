import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getUsers = async (request, response) => {
  try {
    const users = await prisma.user.findMany();
    response.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const register = async (request, response) => {
  const { name, email, password, confPassword, role } = request.body;

  if (password !== confPassword)
    return response.status(400).json({
      error: {
        status: "400 Bad Request",
        message: "Password tidak cocok",
      },
    });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
    });
    response.status(201).json({
      success: {
        status: "201 Created",
        message: "Register berhasil",
      },
    });
  } catch (error) {
    response.status(500).json({
      error: {
        status: "500 Internal Server Error",
        message: "Kesalahan pada server",
      },
    });
  }
};

export const login = async (request, response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: request.body.email,
      },
    });

    if (!user) {
      return response.status(404).json({
        error: {
          status: "404 Not Found",
          message: "Email tidak ditemukan",
        },
      });
    }

    const match = await bcrypt.compare(request.body.password, user.password);
    if (!match)
      return response.status(400).json({
        error: {
          status: "400 Bad Request",
          message: "Password salah",
        },
      });

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true
    });

    response.status(200).json({
      success: {
        status: "200 OK",
        message: "Login berhasil",
        token: accessToken,
      },
    });
  } catch (error) {
    response.status(500).json({
      error: {
        status: "500 Internal Server Error",
        message: "Terjadi kesalahan server",
      },
    });
  }
};

export const logout = async (request, response) => {
  const refreshToken = request.cookies.refreshToken;
  if (!refreshToken)
    return response.status(204).json({
      error: {
        status: "204 No Content",
        message: "Refresh token tidak ditemukan",
      },
    });

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          return response.status(403).json({
            error: {
              status: "403 Forbidden",
              message: "Token tidak valid",
            },
          });
        }

        const userId = decoded.userId;

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            refresh_token: null,
          },
        });

        response.clearCookie("refreshToken");
        response.status(200).json({
          success: {
            status: "200 OK",
            message: "Logout berhasil",
          },
        });
      }
    );
  } catch (error) {
    response.status(500).json({
      error: {
        status: "500 Internal Server Error",
        message: "Terjadi kesalahan server",
      },
    });
  }
};
