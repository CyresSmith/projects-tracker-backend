const { User, userValidation } = require('../schemas/user');
const { Client, clientValidation } = require('../schemas/client');

module.exports = {
  User,
  userValidation,
  Client,
  clientValidation,
};
