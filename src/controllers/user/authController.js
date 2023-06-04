import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { validationResult } from "express-validator";

import {
  loginValidator,
  registerValidator,
} from "../../validation/authValidation.js";

import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responseUtil.js";

const prisma = new PrismaClient();

export const getUsers = async (request, response) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    response
      .status(200)
      .json(createSuccessResponse("Fetched data success", { users }));
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (request, response) => {
  try {
    const userId = request.params.id;

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return response
        .status(404)
        .json(createErrorResponse("User not found", null));
    }

    return response
      .status(200)
      .json(createSuccessResponse("Fetched user successfully", { user }));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(createErrorResponse("Internal server error"));
  }
};

export const register = async (request, response) => {
  const { name, email, password, confPassword } = request.body;

  await Promise.all(
    registerValidator.map((validator) => validator.run(request))
  );

  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return response
      .status(400)
      .json(createErrorResponse(errorMessages.join(", ")));
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return response
        .status(400)
        .json(createErrorResponse("Email already exists"));
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const userId = nanoid();

    await prisma.users.create({
      data: {
        id: userId,
        name: name,
        email: email,
        password: hashPassword,
      },
    });

    response
      .status(201)
      .json(createSuccessResponse("Register success", { name, email }));
  } catch (error) {
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};

export const login = async (request, response) => {
  await Promise.all(loginValidator.map((validator) => validator.run(request)));

  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return response.status(400).json(createErrorResponse(errorMessages));
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        email: request.body.email,
      },
    });

    if (!user) {
      return response.status(404).json(createErrorResponse("Email not found"));
    }

    const match = await bcrypt.compare(request.body.password, user.password);
    if (!match)
      return response.status(400).json(createErrorResponse("Wrong password"));

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET
    );

    await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        token: accessToken,
      },
    });

    response.status(200).json(
      createSuccessResponse("Login success", {
        id: userId,
        name: name,
        email: email,
        token: accessToken,
      })
    );
  } catch (error) {
    console.log(error);
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};

// // Fungsi untuk mengirim permintaan ke API Flask
// const sendPredictionRequest = async (data) => {
//   try {
//     const apiResponse = await axios.post("http://localhost:5000/predict", data);
//     return apiResponse.data.Stunting;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to get prediction from Flask API");
//   }
// };

// // Controller untuk mengecek stunting
// export const cekStunting = async (request, response) => {
//   try {
//     // Data yang akan dikirim ke API Flask
//     const data = {
//       Sex: request.body.sex,
//       Age: parseFloat(request.body.age),
//       "Birth Weight": parseFloat(request.body.birth_weight),
//       "Birth Length": parseFloat(request.body.birth_length),
//       "Body Weight": parseFloat(request.body.body_weight),
//       "Body Length": parseFloat(request.body.body_length),
//       "ASI Eksklusif": request.body.asi_eksklusif,
//     };

//     // Mengirim permintaan POST ke API Flask
//     const stunting = await sendPredictionRequest(data);

//     // Menyimpan hasil prediksi ke model StuntingData
//     await prisma.stuntingData.create({
//       data: {
//         sex: data.Sex,
//         age: data.Age,
//         birth_weight: data["Birth Weight"],
//         birth_length: data["Birth Length"],
//         body_weight: data["Body Weight"],
//         body_length: data["Body Length"],
//         asi_eksklusif: data["ASI Eksklusif"],
//         status_stunting: stunting,
//       },
//     });

//     // Mengambil data dari model StuntingData
//     const stuntingData = await prisma.stuntingData.findMany({
//       select: {
//         status_stunting: true,
//       },
//       orderBy: {
//         created_at: "desc",
//       },
//       take: 1,
//     });

//     // Mengirim hasil prediksi dan data dari model StuntingData sebagai respons dari Express.js
//     response.json({ Stunting: stuntingData });
//   } catch (error) {
//     console.error(error);
//     response.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const statusStunting = async (request, response) => {
//   try {
//     const stuntingData = await prisma.stuntingData.findMany({
//       orderBy: {
//         created_at: "desc",
//       },
//       take: 1,
//     });
//     response.json({ Stunting: stuntingData });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const historyStunting = async (request, response) => {
//   try {
//     // Mengambil data dari model StuntingData
//     const stuntingData = await prisma.stuntingData.findMany({
//       orderBy: {
//         created_at: "desc",
//       },
//     });

//     // Mengirim hasil prediksi dan data dari model StuntingData sebagai respons dari Express.js
//     response.json({ Stunting: stuntingData });
//   } catch (error) {
//     console.log(error);
//   }
// };
