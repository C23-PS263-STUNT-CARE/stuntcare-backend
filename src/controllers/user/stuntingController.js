import { PrismaClient } from "../../utils/importUtil.js";

import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responseUtil.js";

import axios from "axios";

const prisma = new PrismaClient();

const sendPredictionRequest = async (data) => {
  try {
    const apiResponse = await axios.post(
      "https://predict-calqdofn4a-et.a.run.app/predict",
      data
    );
    return apiResponse.data.stunting;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get prediction from Flask API");
  }
};

// Controller untuk mengecek stunting
export const cekStunting = async (request, response) => {
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

    // Data yang akan dikirim ke API Flask
    const data = {
      sex: request.body.sex,
      age: parseFloat(request.body.age),
      birth_weight: parseFloat(request.body.birth_weight),
      birth_length: parseFloat(request.body.birth_length),
      body_weight: parseFloat(request.body.body_weight),
      body_length: parseFloat(request.body.body_length),
      asi_ekslusif: request.body.asi_eksklusif,
    };

    // Mengirim permintaan POST ke API Flask
    const stunting = await sendPredictionRequest(data);

    // Menyimpan hasil prediksi ke model StuntingData
    const stuntingCheck = await prisma.stunting.create({
      data: {
        name: request.body.name,
        sex: data.sex,
        age: data.age,
        birth_weight: data.birth_weight,
        birth_length: data.birth_length,
        body_weight: data.body_weight,
        body_length: data.body_length,
        asi_eksklusif: data.asi_ekslusif,
        status_stunting: stunting,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Mengirim hasil prediksi sebagai respons dari Express.js
    response
      .status(201)
      .json(
        createSuccessResponse("Check Stunting Successfully", stuntingCheck)
      );
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(createErrorResponse("Internal server error"));
  }
};

export const historyStunting = async (request, response) => {
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

    // Mengambil data terbaru dari model StuntingData berdasarkan toddlerId
    const historyCheck = await prisma.stunting.findMany({
      where: {
        toddler_id: toddlerId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    response
      .status(200)
      .json(
        createSuccessResponse(
          "Fetched data history stunting successfully",
          historyCheck
        )
      );
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(createErrorResponse("Internal server error"));
  }
};
