import Validate from '../helpers/validateUser';
/**
 * Returning erros
 * @param {string} error - Error message
 * @param {object} res - request
 * @return {object} error
 */
/**
 * Return errors
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {callback} next - callback
 * @return {error} error
 */
const passwordValidation = (req, res, next) => {
  if (!Validate.password(req.body.password)) {
    return res.status(400).json({ error: 'Your password should be alphanumeric and have at least 8 character long' });
  }
  next();
};

export {
// eslint-disable-next-line import/prefer-default-export
  passwordValidation
};
