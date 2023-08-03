const express = require('express');
const router = express.Router();

const { clientsCtrl } = require('../controller');

const { clientValidation } = require('../schemas');
const { authentication, imageUpload } = require('../middlewares');
const { validateBody } = require('../helpers');
const uploadToGoogleDrive = require('../middlewares/uploadToGoogleDrive');

const {
  clientRegisterSchema,
  emailSchema,
  clientLoginSchema,
  clientUpdateSchema,
} = clientValidation;

router.post(
  '/register',
  uploadToGoogleDrive(),
  validateBody(clientRegisterSchema),
  clientsCtrl.register
);

router.get('/verify/:verificationToken', clientsCtrl.verify);

// router.post('/login', validateBody(clientLoginSchema), clientsCtrl.login);

// router.get('/current', authentication, clientsCtrl.current);

// router.patch(
//   '/update',
//   authentication,
//   validateBody(clientUpdateSchema),
//   clientsCtrl.update
// );

// router.post('/logout', authentication, clientsCtrl.logout);

// router.patch(
//   '/avatars',
//   authentication,
//   imageUpload.single('avatar'),
//   clientsCtrl.updateAvatar
// );

module.exports = router;
