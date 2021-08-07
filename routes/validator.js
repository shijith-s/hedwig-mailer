const joi = require("joi");

const registerValidator = (data) => {
  const regSchema = joi.object({
    name: joi.string().required().min(6),
    username: joi.string().min(6).required(),
    password: joi.string().min(6).required(),
  });
  return regSchema.validate(data);
};

const loginValidator = (data) => {
  const regSchema = joi.object({
    username: joi.string().min(6).required(),
    password: joi.string().min(6).required(),
  });
  return regSchema.validate(data);
};


module.exports = { registerValidator, loginValidator };
