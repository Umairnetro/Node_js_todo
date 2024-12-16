const joi = require("joi");

// Schema for user registration
const registerSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  password: joi.string().min(3).max(128).required(),
});

// Schema for user login
const loginSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

const validate = (data, schema) => {
  const { error } = schema.validate(data);
  return error ? error.details[0].message : "";
};

module.exports = { registerSchema, loginSchema, validate };
