import { jwt } from "../utils/importUtil.js";
import { createErrorResponse } from "../utils/responseUtil.js";

export const verifyToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return response.status(401).json(createErrorResponse("Invalid token key"));
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error)
      response.status(401).json(createErrorResponse("Invalid token key"));
    request.email = decoded.email;
    next();
  });
};
