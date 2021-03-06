import Validate from './validateUser';
/**
 * Returning erros
 * @param {string} error - Error message
 * @param {object} res - request
 * @return {object} error
 */
const validate = (error, res) => res.status(400).json({ error });
/**
 * Return errors
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {callback} next - callback
 * @return {error} error
 */
const userValidate = (req, res, next) => {
  if (Validate.isEmpty(req.body.email)) {
    return validate('Please provide email', res);
  }
  if (!Validate.email(req.body.email)) {
    return validate('Please provide a valid email', res);
  }
  if (!Validate.password(req.body.password)) {
    return validate('Your password should be alphanumeric and have at least 8 character long', res);
  }
  // @check username
  if (Validate.isEmpty(req.body.username)) {
    return validate('Please provide username', res);
  }
  next();
};

export default userValidate;
