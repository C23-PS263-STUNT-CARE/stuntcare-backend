import {
  PrismaClient,
  bcrypt,
  jwt,
  nanoid,
  validationResult,
} from "../utils/importUtil.js";

import {
  loginValidator,
  registerValidator,
} from "../validation/authValidation.js";

import {
  createSuccessResponse,
  createErrorResponse,
} from "../utils/responseUtil.js";

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
