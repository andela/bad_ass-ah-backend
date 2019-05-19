import Validate from './validateUser';

const validate = (error, res) => res.status(400).json({ status: 400, error });
/**
 *
 * @param {Ojbect} req -Request
 * @param {Object} res -Response
 * @param {callback} next - callback
 * @returns {error} error
 */
const commentValidate = (req, res, next) => {
  if (Validate.isEmpty(req.body.text)) {
    return validate('Please add the body of your comments', res);
  }
  next();
};

export default commentValidate;
