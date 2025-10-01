// middleware/validate.js
module.exports = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: "fail",
      errors: error.details.map((d) => d.message),
    });
  }

  req.body = value; // sanitized, validated input
  next();
};
