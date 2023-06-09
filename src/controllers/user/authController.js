import User from "../../models/userModel.js";
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
      .status(200)
      .json(createErrorResponse(errorMessages.join(", ")));
  }

  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return response
        .status(200)
        .json(createErrorResponse("Email already exists"));
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const userId = nanoid();

    await User.create({
      id: userId,
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
    return response.status(200).json(createErrorResponse(errorMessages));
  }

  try {
    const user = await User.findOne({
      where: {
        email: request.body.email,
      },
    });

    if (!user) {
      return response.status(200).json(createErrorResponse("Email not found"));
    }

    const match = await bcrypt.compare(request.body.password, user.password);
    if (!match)
      return response.status(200).json(createErrorResponse("Wrong password"));

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET
    );

    await User.update(
      {
        token: accessToken,
      },
      {
        where: {
          id: userId,
        },
      }
    );

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
