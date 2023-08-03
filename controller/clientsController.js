const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { Client } = require('../schemas');
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const HttpError = require('../helpers/httpError');
const { SECRET, BASE_URL } = process.env;

/**
 * ============================ Client Register
 */
const registerClient = async (req, res) => {
  const { email, password } = req.body;

  const client = await Client.findOne({ email });

  if (client) {
    throw httpError(409, `Email in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = uuid();

  const newClient = await Client.create({
    ...req.body,
    password: hashPassword,
    avatarUrl:
      'https://res.cloudinary.com/dqejymgnk/image/upload/v1684344303/avatar/Group_1000002112_2x_i1bd8a.png',
    verificationToken,
  });

  const verificationEmail = {
    to: email,
    subject: 'Verification email',
    html: `<a target="_blank" href="${BASE_URL}/clients/verify/${verificationToken}" >Click here to verify your email</a>`,
  };

  await sendEmail(verificationEmail);

  res.status(201).json({
    message: `Welcome aboard ${newClient.fullName}, please check Your email and confirm registration.`,
  });
};

/**
 * ============================ Верификация пользователя
 */
const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const client = await Client.findOne({ verificationToken: verificationToken });

  if (!client) {
    throw HttpError(404, 'User not found');
  }

  await Client.findByIdAndUpdate(client._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: `Verification successful`,
  });
};

/**
 * ============================ Повторная отсылка письма верификации пользователя
 */
const reVerify = async (req, res) => {
  const { email } = req.body;

  const client = await Client.findOne({ email });

  if (!client) {
    throw HttpError(404, 'Email not found');
  }

  if (client.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verificationEmail = {
    to: email,
    subject: 'Verification email',
    html: `<a target="_blank" href="${BASE_URL}/clients/verify/${client.verificationToken}">Click here to verify your email</a>`,
  };

  await sendEmail(verificationEmail);

  res.status(200).json({
    message: `Verification email sent`,
  });
};

/**
 * ============================ Login client
 */
const loginClient = async (req, res) => {
  const { email } = req.body;

  const client = await Client.findOne(
    { email },
    '-services -desc -mission -values -goals -files -links -budget -dateStart -deadline -avatarUrl -verificationToken -createdAt -updatedAt -token'
  );

  if (!client) {
    throw httpError(401, `Email or password is wrong`);
  }

  if (!client.verify) {
    throw httpError(401, `Email not verify`);
  }

  const checkPassword = await bcrypt.compare(
    req.body.password,
    client.password
  );

  if (!checkPassword) {
    throw httpError(401, `Email or password is wrong`);
  }

  const payload = {
    _id: client._id,
    fullName: client.fullName,
    email: client.email,
    phone: client.phone,
    verify: client.verify,
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: '23h' });

  await Client.findByIdAndUpdate(client._id, { token });

  res.status(200).json({
    token,
    client: payload,
  });
};

// /**
//  * ============================ Current client
//  */
// const getCurrentClient = async (req, res) => {
//   const { _id } = req.user;

//   const user = await User.findById(
//     _id,
//     '-createdAt -updatedAt -password -token -verifycationToken'
//   ).populate('favorite', '-createdAt -updatedAt');

//   res.status(200).json(user);
// };

// /**
//  * ============================ Обновление профиля пользователя
//  */
// const userUpdate = async (req, res) => {
//   const { _id } = req.user;

//   const result = await User.findByIdAndUpdate(_id, req.body, {
//     new: true,
//     fields: {
//       token: 0,
//       password: 0,
//       verifycationToken: 0,
//       createdAt: 0,
//       updatedAt: 0,
//     },
//   }).populate('favorite', '-createdAt -updatedAt');

//   res.status(200).json(result);
// };

// /**
//  * ============================ Logout пользователя
//  */
// const logout = async (req, res) => {
//   const { _id } = req.user;

//   await User.findByIdAndUpdate(_id, { token: null });

//   res.status(200).json({ message: `Successfully logout` });
// };

// /**
//  * ============================ Обновление аватарки пользователя
//  */
// const updateAvatar = async (req, res) => {
//   const { _id } = req.user;

//   try {
//     const result = await User.findByIdAndUpdate(
//       _id,
//       { avatarUrl: req.file.path },
//       {
//         new: true,
//         fields: {
//           avatarUrl: 1,
//         },
//       }
//     );

//     res.status(200).json({
//       avatarUrl: result.avatarUrl,
//       message: `Avatar successfully updated`,
//     });
//   } catch (error) {
//     throw httpError(400);
//   }
// };

module.exports = {
  register: ctrlWrapper(registerClient),
  verify: ctrlWrapper(verify),
  reVerify: ctrlWrapper(reVerify),
  login: ctrlWrapper(loginClient),
  // current: ctrlWrapper(getCurrentUser),
  // update: ctrlWrapper(userUpdate),
  // logout: ctrlWrapper(logout),
  // updateAvatar: ctrlWrapper(updateAvatar),
};
