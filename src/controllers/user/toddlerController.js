import { PrismaClient } from "../../utils/importUtil.js";

import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responseUtil.js";

const prisma = new PrismaClient();

export const createToddler = async (request, response) => {
  try {
    const userId = request.params.userId;

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return response.status(404).json(createErrorResponse("User not found"));
    }

    const { name } = request.body;
    const toddler = await prisma.toddlers.create({
      data: {
        name: name,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    response
      .status(201)
      .json(createSuccessResponse("Create Toddler Successfully", toddler));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(createErrorResponse("Internal server error"));
  }
};
