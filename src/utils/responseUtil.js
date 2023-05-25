export const createSuccessResponse = (message, data = null) => {
  return {
    results: {
      error: false,
      message: message,
      data: data,
    },
  };
};

export const createErrorResponse = (message) => {
  return {
    results: {
      error: true,
      message: message,
    },
  };
};
