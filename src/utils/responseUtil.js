export const createSuccessResponse = (message, data = null) => {
  return {
    error: false,
    message: message,
    data: data,
  };
};

export const createErrorResponse = (message) => {
  return {
    error: true,
    message: message,
  };
};
