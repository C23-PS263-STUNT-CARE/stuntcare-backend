import { PrismaClient } from "../../utils/importUtil.js";

import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responseUtil.js";

import axios from "axios";

const prisma = new PrismaClient();

const sendPredictionRequest = async (data) => {
  try {
    const apiResponse = await axios.post("http://localhost:5000/predict", data);
    return apiResponse.data.Stunting;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get prediction from Flask API");
  }
};

// Controller untuk mengecek stunting
export const cekStunting = async (request, response) => {
  try {
    const userId = request.params.userId;
    const toddlerId = parseInt(request.params.toddlerId);

    // Mengambil data toddler berdasarkan id dan user id
    const toddler = await prisma.toddlers.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!toddler) {
      return response
        .status(404)
        .json(createErrorResponse("Toddler not found"));
    }

    // Data yang akan dikirim ke API Flask
    const data = {
      Sex: request.body.sex,
      Age: parseFloat(request.body.age),
      "Birth Weight": parseFloat(request.body.birth_weight),
      "Birth Length": parseFloat(request.body.birth_length),
      "Body Weight": parseFloat(request.body.body_weight),
      "Body Length": parseFloat(request.body.body_length),
      "ASI Eksklusif": request.body.asi_eksklusif,
    };

    // Mengirim permintaan POST ke API Flask
    const stunting = await sendPredictionRequest(data);

    // Menyimpan hasil prediksi ke model StuntingData
    await prisma.stuntingData.create({
      data: {
        sex: data.Sex,
        age: data.Age,
        birth_weight: data["Birth Weight"],
        birth_length: data["Birth Length"],
        body_weight: data["Body Weight"],
        body_length: data["Body Length"],
        asi_eksklusif: data["ASI Eksklusif"],
        status_stunting: stunting,
        toddler: {
          connect: {
            id: toddler.id,
          },
        },
      },
    });

    // Mengambil data terbaru dari model StuntingData berdasarkan toddlerId
    const stuntingCheck = await prisma.stuntingData.findFirst({
      where: {
        toddler_id: toddlerId,
      },
      orderBy: {
        created_at: "desc",
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

export const statusStunting = async (request, response) => {
  try {
    const userId = request.params.userId;
    const toddlerId = parseInt(request.params.toddlerId);

    // Mengambil data toddler berdasarkan id dan user id
    const toddler = await prisma.toddlers.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!toddler) {
      return response
        .status(404)
        .json(createErrorResponse("Toddler not found"));
    }

    // Mengambil data terbaru dari model StuntingData berdasarkan toddlerId
    const latestStuntingData = await prisma.stuntingData.findFirst({
      where: {
        toddler_id: toddlerId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 1,
    });

    response
      .status(200)
      .json(
        createSuccessResponse(
          "Fetched data status stunting successfully",
          latestStuntingData
        )
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
    const toddlerId = parseInt(request.params.toddlerId);

    // Mengambil data toddler berdasarkan id dan user id
    const toddler = await prisma.toddlers.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!toddler) {
      return response
        .status(404)
        .json(createErrorResponse("Toddler not found"));
    }

    // Mengambil data terbaru dari model StuntingData berdasarkan toddlerId
    const historyCheck = await prisma.stuntingData.findMany({
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
