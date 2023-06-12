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
    return apiResponse.data.prediction;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get prediction from Flask API");
  }
};

export const cekStunting = async (request, response) => {
  try {
    const userId = request.params.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return response.status(200).json(createErrorResponse("User not found"));
    }

    const data = {
      sex: request.body.sex,
      age: parseFloat(request.body.age),
      birth_weight: parseFloat(request.body.birth_weight),
      birth_length: parseFloat(request.body.birth_length),
      body_weight: parseFloat(request.body.body_weight),
      body_length: parseFloat(request.body.body_length),
      asi_ekslusif: request.body.asi_eksklusif,
    };

    const prediction = await sendPredictionRequest(data);

    const stuntingCheck = await Stunting.create({
      name: request.body.name,
      sex: data.sex,
      age: data.age,
      birth_weight: data.birth_weight,
      birth_length: data.birth_length,
      body_weight: data.body_weight,
      body_length: data.body_length,
      asi_eksklusif: data.asi_ekslusif,
      status_stunting: prediction,
      user_id: user.id,
    });

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

export const getAllStuntingByUserId = async (request, response) => {
  try {
    const userId = request.params.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return response.status(200).json(createErrorResponse("User not found"));
    }

    const stunting = await Stunting.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });

    if (!stunting || stunting.length === 0) {
      return response
        .status(200)
        .json(createErrorResponse("No stunting data found for this user"));
    }

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

export const getStuntingById = async (request, response) => {
  try {
    const userId = request.params.userId;
    const stuntingId = request.params.stuntingId;

    const user = await User.findByPk(userId);

    if (!user) {
      return response.status(200).json(createErrorResponse("User not found"));
    }

    const stunting = await Stunting.findOne({
      where: { id: stuntingId, user_id: userId },
    });

    if (!stunting) {
      return response
        .status(200)
        .json(createErrorResponse("Stunting data not found"));
    }

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

export const editStuntingById = async (request, response) => {
  try {
    const userId = request.params.userId;
    const stuntingId = request.params.stuntingId;

    const user = await User.findByPk(userId);

    if (!user) {
      return response.status(200).json(createErrorResponse("User not found"));
    }

    const stunting = await Stunting.findOne({
      where: { id: stuntingId, user_id: userId },
    });

    if (!stunting) {
      return response
        .status(200)
        .json(createErrorResponse("Stunting data not found"));
    }

    const data = {
      sex: request.body.sex,
      age: parseFloat(request.body.age),
      birth_weight: parseFloat(request.body.birth_weight),
      birth_length: parseFloat(request.body.birth_length),
      body_weight: parseFloat(request.body.body_weight),
      body_length: parseFloat(request.body.body_length),
      asi_ekslusif: request.body.asi_eksklusif,
    };

    const prediction = await sendPredictionRequest(data);

    stunting.name = request.body.name;
    stunting.sex = data.sex;
    stunting.age = data.age;
    stunting.birth_weight = data.birth_weight;
    stunting.birth_length = data.birth_length;
    stunting.body_weight = data.body_weight;
    stunting.body_length = data.body_length;
    stunting.asi_eksklusif = data.asi_ekslusif;
    stunting.status_stunting = prediction;

    await stunting.save();

    response
      .status(200)
      .json(
        createSuccessResponse("Stunting data updated successfully", stunting)
      );
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(createErrorResponse("Internal server error"));
  }
};

export const deleteStuntingById = async (request, response) => {
  try {
    const userId = request.params.userId;
    const stuntingId = request.params.stuntingId;

    const user = await User.findByPk(userId);

    if (!user) {
      return response.status(200).json(createErrorResponse("User not found"));
    }

    const stunting = await Stunting.findOne({
      where: { id: stuntingId, user_id: userId },
    });

    if (!stunting) {
      return response
        .status(200)
        .json(createErrorResponse("Stunting data not found"));
    }

    await stunting.destroy();

    response
      .status(200)
      .json(createSuccessResponse("Stunting data deleted successfully"));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(createErrorResponse("Internal server error"));
  }
};
