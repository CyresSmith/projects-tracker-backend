const HttpError = require('./httpError');

/**
 * Функция валидации данных.
 */
const validateBody = schema => {
  const func = async (req, res, next) => {
    console.log('🚀 ~ file: validateBody.js:8 ~ func ~ req:', req.body);

    // let validatedObj = {};

    // if (req.file) {
    //   const { fieldname, path } = req.file;
    //   validatedObj = { ...req.body, [fieldname]: path };
    // } else {
    //   validatedObj = { ...req.body };
    // }

    // const { error } = schema.validate(validatedObj);

    // if (error) {
    //   next(HttpError(400, error.message));
    // }
    next();
  };

  return func;
};

module.exports = validateBody;
