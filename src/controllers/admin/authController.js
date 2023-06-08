import Admin from "../../models/adminModel.js";
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
    const existingAdmin = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (existingAdmin) {
      return response
        .status(400)
        .json(createErrorResponse("Email already exists"));
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const adminId = nanoid();

    await Admin.create({
      id: adminId,
      name: name,
      email: email,
      password: hashPassword,
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
    const admin = await Admin.findOne({
      where: {
        email: request.body.email,
      },
    });

    if (!admin) {
      return response.status(404).json(createErrorResponse("Email not found"));
    }

    const match = await bcrypt.compare(request.body.password, admin.password);
    if (!match)
      return response.status(400).json(createErrorResponse("Wrong password"));

    const adminId = admin.id;
    const name = admin.name;
    const email = admin.email;
    const accessToken = jwt.sign(
      { adminId, name, email },
      process.env.ACCESS_TOKEN_SECRET
    );

    await Admin.update(
      {
        token: accessToken,
      },
      {
        where: {
          id: adminId,
        },
      }
    );

    response.status(200).json(
      createSuccessResponse("Login success", {
        id: adminId,
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
