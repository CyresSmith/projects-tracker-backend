const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
// const { nanoid } = require('nanoid');

require('dotenv').config();

const { Client } = require('../schemas');
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const { SECRET } = process.env;

/**
 * ============================ Client Register
 */
const registerClient = async (req, res) => {
  console.log(
    '🚀 ~ file: clientsController.js:16 ~ registerClient ~ req:',
    req.body
  );
  // const { email, password } = req.body;

  // const client = await Client.findOne({ email });

  // if (client) {
  //   throw httpError(409, `Email in use`);
  // }

  // const hashPassword = await bcrypt.hash(password, 10);

  // // const verifycationToken = nanoid();

  // const newClient = await Client.create({
  //   ...req.body,
  //   password: hashPassword,
  //   avatarUrl:
  //     'https://res.cloudinary.com/dqejymgnk/image/upload/v1684344303/avatar/Group_1000002112_2x_i1bd8a.png',
  //   // verifycationToken,
  // });

  // const verifycationEmail = {
  //   to: email,
  //   subject: 'Verifycation email',
  //   html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verifycationToken}" >Click here to verify your email</a>`,
  // };

  // await sendEmail(verifycationEmail);

  res.status(201).json(`{
    email: newClient.email,
  }`);
};

// /**
//  * ============================ Верификация пользователя
//  */
// const verify = async (req, res) => {
//   const { verifycationToken } = req.params;

//   const user = await User.findOne({ verifycationToken });

//   if (!user) {
//     throw HttpError(404, 'User not found');
//   }

//   await User.findByIdAndUpdate(user._id, {
//     verify: true,
//     verifycationToken: null,
//   });

//   res.status(200).json({
//     message: `Verification successful`,
//   });
// };

// /**
//  * ============================ Повторная отсылка письма верификации пользователя
//  */
// const reVerify = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     throw HttpError(404, 'Email not found');
//   }

//   if (user.verify) {
//     throw HttpError(400, 'Verification has already been passed');
//   }

//   const verifycationEmail = {
//     to: email,
//     subject: 'Verifycation email',
//     html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verifycationToken}">Click here to verify your email</a>`,
//   };

//   await sendEmail.nodemailer(verifycationEmail);

//   res.status(200).json({
//     message: `Verification email sent`,
//   });
// };

// /**
//  * ============================ Login client
//  */
// const loginClient = async (req, res) => {
//   const { email, password } = req.body;

//   const client = await Client.findOne({ email }).populate(
//     'favorite',
//     '-createdAt -updatedAt'
//   );

//   if (!client) {
//     throw httpError(401, `Email or password is wrong`);
//   }

//   // if (!user.verify) {
//   //   throw httpError(401, `Email not veryfi`);
//   // }

//   const checkPassword = await bcrypt.compare(password, client.password);

//   if (!checkPassword) {
//     throw httpError(401, `Email or password is wrong`);
//   }

//   const { password, ...payload } = client;

//   const token = jwt.sign(payload, SECRET, { expiresIn: '23h' });

//   await Client.findByIdAndUpdate(client._id, { token });

//   res.status(200).json({
//     token,
//     client: payload,
//   });
// };

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
  // verify: ctrlWrapper(verify),
  // reVerify: ctrlWrapper(reVerify),
  // login: ctrlWrapper(loginUser),
  // current: ctrlWrapper(getCurrentUser),
  // update: ctrlWrapper(userUpdate),
  // logout: ctrlWrapper(logout),
  // updateAvatar: ctrlWrapper(updateAvatar),
};
