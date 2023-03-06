const httpError = (res, code, message) => {
  let error = {};
  switch (code) {
    case 400:
      error = {
        status: "Error",
        data: { message: message || "Bad Request" },
        code: code,
      };
      break;
    case 401:
      error = {
        status: "Error",
        data: { message: message || "Unauthorized" },
        code: code,
      };
      break;
    case 403:
      error = {
        status: "Error",
        data: { message: message || "Forbidden" },
        code: code,
      };
      break;
    case 404:
      error = {
        status: "Error",
        data: { message: message || "Not Found" },
        code: code,
      };
      break;
    case 405:
      error = {
        status: "Error",
        data: { message: message || "Method Not Allowed" },
        code: code,
      };
      break;
    case 409:
      error = {
        status: "Error",
        data: { message: message || "Conflict" },
        code: code,
      };
      break;
    case 422:
      error = {
        status: "Error",
        data: { message: message || "Unprocessable Entity" },
        code: code,
      };
      break;
    case 500:
      error = {
        status: "Error",
        data: { message: message || "Internal Server Error" },
        code: code,
      };
      break;
    default:
      error = {
        status: "Error",
        data: { message: "Internal Server Error" },
        code: 500,
      };
      break;
  }

  if (res) {
    return res.status(code).json(error);
  } else {
    return error;
  }
};

module.exports = { httpError };
