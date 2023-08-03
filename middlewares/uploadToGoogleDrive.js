const { google } = require('googleapis');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

function getGoogleOAuthClient() {
  const credentials = require('../projects-tracker-394715-f74a8ce0f00d.json');

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
}

const auth = getGoogleOAuthClient();

const drive = google.drive({ version: 'v3', auth });

// Функция для создания новой папки на Google Диске
async function createFolderOnGoogleDrive(clientName) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: clientName,
        parents: ['1DTlExLVvTyibsNIPn4ftc6MiAKo-KDpL'],
        mimeType: 'application/vnd.google-apps.folder',
      },
    });

    return response.data.id; // Возвращаем ID созданной папки
  } catch (error) {
    console.error('Ошибка при создании папки на Google Диске:', error.message);
    throw new Error('Ошибка при создании папки на Google Диске.');
  }
}

async function uploadFileToGoogle(file, folderId) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
    });

    fs.unlinkSync(file.path);

    return response.data.id;
  } catch (error) {
    console.error('Ошибка загрузки файла на Google Диск:', error.message);
    throw new Error('Ошибка загрузки файла на Google Диск.');
  }
}

function uploadToGoogleDrive() {
  const tempDir = path.join(__dirname, '../', 'temp');

  const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 10,
    },
  });

  const upload = multer({ storage });

  return (req, res, next) => {
    upload.array('files', 10)(req, res, async err => {
      if (!req.files || req.files.length === 0) return next();

      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send('Размер файла превышает 10 МБ.');
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res
            .status(400)
            .send('Превышено ограничение на количество файлов (максимум 10).');
        }
      } else if (err) {
        return res.status(400).send('Ошибка загрузки файла.');
      }

      try {
        const files = req.files;
        const fileUrls = [];
        const client = `${req.body.fullName}_${req.body.email}`; // Получаем имя клиента из запроса

        const folderId = await createFolderOnGoogleDrive(client);

        for (const file of files) {
          const fileId = await uploadFileToGoogle(file, folderId);

          const fileInfo = await drive.files.get({
            fileId,
            fields: 'webViewLink',
          });

          const url = fileInfo.data.webViewLink;

          fileUrls.push(url);
        }

        req.files = fileUrls;

        next();
      } catch (error) {
        res
          .status(500)
          .send('Произошла ошибка при загрузке файлов на Google Диск.');
      }
    });
  };
}

module.exports = uploadToGoogleDrive;
