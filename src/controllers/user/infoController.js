import Info from "../../models/infoModel.js";
import { createSuccessResponse } from "../../utils/responseUtil.js";

export const getInfo = async (request, response) => {
  try {
    const info = await Info.findAll();

    response
      .status(200)
      .json(createSuccessResponse("fetch data info successfully", info));
  } catch (error) {
    console.log(error);
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};
