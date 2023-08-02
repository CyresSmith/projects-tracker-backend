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

const client = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      min: [6, 'Full name should have a minimum length of 6'],
      max: [30, 'Full name should have a maximum length of 20'],
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
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: phoneRegex,
      default: null,
    },
    services: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'Must have at least one element.',
      },
    },
    desc: {
      type: String,
      required: [true, 'Description is required'],
      min: [30, 'Description should have a minimum length of 30'],
      max: [100, 'Description should have a maximum length of 300'],
    },
    mission: {
      type: String,
      required: [true, 'Mission is required'],
      min: [30, 'Mission should have a minimum length of 30'],
      max: [100, 'Mission should have a maximum length of 300'],
    },
    values: {
      type: String,
      required: [true, 'Values is required'],
      min: [30, 'Values should have a minimum length of 30'],
      max: [100, 'Values should have a maximum length of 300'],
    },
    goals: {
      type: String,
      required: [true, 'Goals is required'],
      min: [30, 'Goals should have a minimum length of 30'],
      max: [100, 'Goals should have a maximum length of 300'],
    },
    files: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: 'Max 10 files.',
      },
      default: [],
    },
    links: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: 'Max 10 links.',
      },
      default: [],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [200, 'Budget should have minimum $200'],
      max: [5000, 'Budget should have maximum $5000'],
    },
    dateStart: {
      type: Date,
      default: null,
    },
    deadline: {
      type: Date,
      default: null,
    },
    avatarUrl: {
      type: String,
      required: [true, 'Avatar url is required'],
    },
    token: {
      type: String,
      default: null,
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
const clientRegisterSchema = Joi.object({
  fullName: Joi.string().required().min(6).max(20).messages({
    'string.empty': `"Full name" cannot be empty`,
    'string.base': `"Full name" must be string`,
    'string.min': `"Full name" should have a minimum length of {#limit}`,
    'string.max': `"Full name" should have a maximum length of {#limit}`,
    'any.required': `"Full name" is required`,
  }),

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

  services: Joi.array()
    .items(
      Joi.string().messages({
        'string.empty': 'Each element in the array cannot be empty.',
      })
    )
    .min(1, 'The array must have at least one element.')
    .messages({
      'array.base': 'Services must be an array.',
      'array.min': 'Services must have at least one element.',
    })
    .required(),

  desc: Joi.string().min(30).max(300).messages({
    'string.empty': `"Description" cannot be empty`,
    'string.base': `"Description" must be string`,
    'string.min': `"Description" should have a minimum length of {#limit}`,
    'string.max': `"Description" should have a maximum length of {#limit}`,
  }),

  mission: Joi.string().min(30).max(300).messages({
    'string.empty': `"Mission" cannot be empty`,
    'string.base': `"Mission" must be string`,
    'string.min': `"Mission" should have a minimum length of {#limit}`,
    'string.max': `"Mission" should have a maximum length of {#limit}`,
  }),

  values: Joi.string().min(30).max(300).messages({
    'string.empty': `"Values" cannot be empty`,
    'string.base': `"Values" must be string`,
    'string.min': `"Values" should have a minimum length of {#limit}`,
    'string.max': `"Values" should have a maximum length of {#limit}`,
  }),

  goals: Joi.string().min(30).max(300).messages({
    'string.empty': `"Goals" cannot be empty`,
    'string.base': `"Goals" must be string`,
    'string.min': `"Goals" should have a minimum length of {#limit}`,
    'string.max': `"Goals" should have a maximum length of {#limit}`,
  }),

  files: Joi.array()
    .items(
      Joi.string().messages({
        'string.empty': 'File cannot be empty.',
      })
    )
    .messages({
      'array.base': 'Files must be an array.',
    }),

  links: Joi.array()
    .items(
      Joi.string().messages({
        'string.empty': 'Link cannot be empty.',
      })
    )
    .messages({
      'array.base': 'Links must be an array.',
    }),

  budget: Joi.number().min(200).max(5000).required().messages({
    'number.base': 'Budget must be a number.',
    'number.empty': 'Budget cannot be empty.',
    'number.min': 'Budget must be at least 200.',
    'number.max': 'Budget cannot exceed 5000.',
    'any.required': 'Budget is required.',
  }),

  dateStart: Joi.date().iso().min('now').required().messages({
    'date.base': 'Start date must be a valid date.',
    'date.empty': 'Start date cannot be empty.',
    'date.min': 'Start date cannot be earlier than today.',
    'any.required': 'Start date is required.',
  }),

  deadline: Joi.date().iso().min('now').required().messages({
    'date.base': 'Start date must be a valid date.',
    'date.empty': 'Start date cannot be empty.',
    'date.min': 'Start date cannot be earlier than today.',
    'any.required': 'Start date is required.',
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
const clientLoginSchema = Joi.object({
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

const clientUpdateSchema = Joi.object({
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

client.post('save', handleMongooseError);

const clientValidation = {
  clientRegisterSchema,
  emailSchema,
  clientLoginSchema,
  clientUpdateSchema,
};

const Client = model('client', client);

module.exports = { Client, clientValidation };
