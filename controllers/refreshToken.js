import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const refreshToken = async (request, response) => {
  try {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) return response.send(401);
    const user = await prisma.user.findMany({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) return response.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) response.sendStatus(403);
        const userId = user.id;
        const firstName = user.first_name;
        const lastName = user.last_name;
        const email = user.email;
        const accessToken = jwt.sign(
          { userId, firstName, lastName, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        response.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
