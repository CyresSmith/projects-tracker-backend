const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const {
  emailRegexp,
  phoneRegex,
  passwordRegex,
} = require('./validationRegexps');

const Joi = require('joi')
  .extend(require('@joi/date'))
  .extend(require('joi-phone-number'));

const user = new Schema(
  {
    fullName: {
      type: String,
      min: [6, 'Name should have a minimum length of 6'],
      max: [30, 'Name should have a maximum length of 30'],
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      min: [8, 'Password should have a minimum length of 8'],
      max: [16, 'Password should have a maximum length of 16'],
    },
    email: {
      required: [true, 'Email is required'],
      type: String,
      match: emailRegexp,
      unique: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['admin', 'designer', 'developer'],
    },
    phone: {
      type: String,
      match: phoneRegex,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      required: [true, 'Avatar url is required'],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

/**
 * Схема валидации регистрации пользователя.
 */
const userRegisterSchema = Joi.object({
  fullName: Joi.string()
    .min(6)
    .max(20)
    .messages({
      'string.empty': `"Name" cannot be empty`,
      'string.base': `"Name" must be string`,
      'string.min': `"Name" should have a minimum length of {#limit}`,
      'string.max': `"Name" should have a maximum length of {#limit}`,
    })
    .required(),

  password: Joi.string()
    .min(8)
    .max(16)
    .regex(passwordRegex)
    .messages({
      'any.required': `"Password" is required`,
      'string.empty': `"Password" cannot be empty`,
      'string.base': `"Password" must be string`,
      'string.min': `"Password" should have a minimum length of {#limit}`,
      'string.max': `"Password" should have a maximum length of {#limit}`,
      'string.pattern.base': `"Password" should have at least 1 uppercase letter, 1 lowercase letter and 1 digit!`,
    })
    .required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),

  phone: Joi.string()
    .phoneNumber({ format: 'international' })
    .messages({
      'string.empty': `"Phone" cannot be empty`,
      'string.base': `"Phone" must be string`,
    })
    .required(),

  role: Joi.string()
    .valid('admin', 'designer', 'developer')
    .required()
    .messages({
      'string.base': 'Role must be a string.',
      'string.empty': 'Role cannot be empty.',
      'any.only': 'Role must be one of "admin", "designer", or "developer".',
      'any.required': 'Role is required.',
    }),
});

/**
 * Схема валидации email.
 */
const emailSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'ua'] },
  }),
});

/**
 * Схема валидации логина пользователя.
 */
const userLoginSchema = Joi.object({
  password: Joi.string().min(6).max(16).regex(passwordRegex).messages({
    'any.required': `"Password" is required`,
    'string.empty': `"Password" cannot be empty`,
    'string.base': `"Password" must be string`,
    'string.min': `"Password" should have a minimum length of {#limit}`,
    'string.max': `"Password" should have a maximum length of {#limit}`,
    'string.pattern.base': `"Password" should have at least 1 uppercase letter, 1 lowercase letter and 1 digit!`,
  }),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'ua'] },
  }),
});

/**
 * Схема валидации обновления профиля пользователя.
 */

const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.empty': `"Name" cannot be empty`,
    'string.base': `"Name" must be string`,
    'string.min': `"Name" should have a minimum length of {#limit}`,
    'string.max': `"Name" should have a maximum length of {#limit}`,
  }),

  password: Joi.string().min(6).max(16).regex(passwordRegex).messages({
    'any.required': `"Password" is required`,
    'string.empty': `"Password" cannot be empty`,
    'string.base': `"Password" must be string`,
    'string.min': `"Password" should have a minimum length of {#limit}`,
    'string.max': `"Password" should have a maximum length of {#limit}`,
    'string.pattern.base': `"Password" should have at least 1 uppercase letter, 1 lowercase letter and 1 digit!`,
  }),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'ua'] },
  }),

  phone: Joi.string().phoneNumber({ format: 'international' }).messages({
    'string.empty': `"Phone" cannot be empty`,
    'string.base': `"Phone" must be string`,
  }),
}).min(1);

user.post('save', handleMongooseError);

const userValidation = {
  userRegisterSchema,
  emailSchema,
  userLoginSchema,
  userUpdateSchema,
};

const User = model('user', user);

module.exports = { User, userValidation };
