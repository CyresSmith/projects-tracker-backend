const HttpError = require('./httpError');

/**
 * Функция валидации данных.
 */
const validateBody = schema => {
  const func = async (req, res, next) => {
    const validatedObj = { ...req.body };

    const arrayFieldParse = field => {
      const array = JSON.parse(field);

      if (Array.isArray(array)) {
        return array;
      }

      return field;
    };

    if (req.body.services)
      validatedObj.services = arrayFieldParse(req.body.services);

    if (req.body.links) validatedObj.links = arrayFieldParse(req.body.links);

    const { error } = schema.validate(validatedObj);

    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = validateBody;
