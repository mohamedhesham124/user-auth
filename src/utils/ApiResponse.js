// utils/response.js
exports.success = (res, message, data = null, statusCode = 200) => {
  const response = { status: "success", message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

exports.fail = (res, message, errors = [], statusCode = 400) => {
  const response = { status: "fail", message };
  if (errors.length > 0) response.errors = errors;
  return res.status(statusCode).json(response);
};

exports.error = (res, message = "Internal Server Error", statusCode = 500, error = null) => {
  const response = { status: "error", message };
  if (error) response.details = error; // optional extra debugging info
  return res.status(statusCode).json(response);
};
