/* Express */
import express from "express";

/* cors */
import cors from "cors";

/* dotenv */
import dotenv from "dotenv";

/* Prisma Schema */
import { PrismaClient } from "@prisma/client";

/* JSON Web Token */
import jwt from "jsonwebtoken";

/* Hashing Password */
import bcrypt from "bcrypt";

/* Generate Id */
import { nanoid } from "nanoid";

/* Express Validator */
import { validationResult } from "express-validator";
import { body } from "express-validator";

export {
  express,
  cors,
  dotenv,
  PrismaClient,
  jwt,
  bcrypt,
  nanoid,
  validationResult,
  body,
};
