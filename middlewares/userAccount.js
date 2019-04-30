import models from '../models/index';
import httpError from '../helpers/errors/httpError';

const User = models.user;

/**
 * User account's middleware
 * @exports
 * @class
 */
class UserAccount {
  /**
  * Check if the user account is activated
  * @param {object} req - request from user
  * @param {object} res - response
  * @param {callback} next - The callback that handles a next functionality
  * @returns {object} response
  */
  static async isUserAccountActivated(req, res, next) {
    const user = await User.findByPk(req.user.id);
    if (user.isActivated) {
      next();
    } else {
      throw new httpError(403, 'Not allowed. You need to verify your email account.');
    }
  }
}

export default UserAccount;
