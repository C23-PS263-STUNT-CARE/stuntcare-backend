import User from "../../models/userModel.js";
import Stunting from "../../models/stuntingModel.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responseUtil.js";
import axios from "axios";

const sendPredictionRequest = async (data) => {
  try {
    const apiResponse = await axios.post("http://127.0.0.1:5000/predict", data);
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

    const user = await User.findByPk(userId);

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

    // Menyimpan hasil prediksi ke model Stunting
    const stuntingCheck = await Stunting.create({
      name: request.body.name,
      sex: data.sex,
      age: data.age,
      birth_weight: data.birth_weight,
      birth_length: data.birth_length,
      body_weight: data.body_weight,
      body_length: data.body_length,
      asi_eksklusif: data.asi_eksklusif,
      status_stunting: stunting,
      user_id: user.id,
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

// Controller untuk mendapatkan semua data stunting berdasarkan ID pengguna
export const getAllStuntingByUserId = async (request, response) => {
  try {
    const userId = request.params.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return response.status(404).json(createErrorResponse("User not found"));
    }

    const stunting = await Stunting.findAll({
      where: { user_id: userId },
    });

    if (!stunting || stunting.length === 0) {
      return response
        .status(404)
        .json(createErrorResponse("No stunting data found for this user"));
    }

    // Mengirim hasil data stunting sebagai respons dari Express.js
    response
      .status(200)
      .json(
        createSuccessResponse("Stunting data retrieved successfully", stunting)
      );
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(createErrorResponse("Internal server error"));
  }
};

export const historyStuntingById = async (request, response) => {
  try {
    const stuntingId = request.params.stuntingId;

    const stunting = await Stunting.findByPk(stuntingId);

    if (!stunting) {
      return response
        .status(404)
        .json(createErrorResponse("Stunting data not found"));
    }

    // Mengirim hasil data stunting sebagai respons dari Express.js
    response
      .status(200)
      .json(
        createSuccessResponse("Stunting data retrieved successfully", stunting)
      );
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(createErrorResponse("Internal server error"));
  }
};
