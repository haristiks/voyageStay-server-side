const Joi = require("joi");

const joiUserCreationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const joiUserLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const joiUserUpdationSchema = Joi.object({
  name: Joi.string(),
  password: Joi.string(),
  image: Joi.string(),
});

const joiListingCreationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  imageSrc: Joi.string().required(),
  category: Joi.string().required(),
  roomCount: Joi.number().required(),
  bathroomCount: Joi.number().required(),
  guestCount: Joi.number().required(),
  location: Joi.string().required(),
  price: Joi.number().required(),
});

module.exports = {
  joiUserCreationSchema,
  joiUserLoginSchema,
  joiListingCreationSchema,
  joiUserUpdationSchema
};
