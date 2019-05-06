import jwt from 'jsonwebtoken';
import models from '../../models/index';
// eslint-disable-next-line import/named
import { secretOrkey } from '../../config/config';
import sendEmail from '../../helpers/sendEmail/callMailer';

const User = models.user;

/**
 * Control email verification
 * @exports
 * @class
 */
class LinkVerification {
  /**
   * Send the verification email to a user
   * @param {Object} req - Requests from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async sendEmail(req, res) {
    const { token, template } = req.body;
    const decoded = jwt.decode(token, secretOrkey);
    try {
      if (decoded) {
        const response = await sendEmail(decoded.email, token, template);
        res.status(200).send({
          status: 200,
          response
        });
      } else {
        throw new Error('Valid token is required');
      }
    } catch (error) {
      res.status(400).send({
        status: 400,
        error: error.message
      });
    }
  }

  /**
   * Send verification email to the user
   * @param {Object} req - Requests from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  async activateAccount(req, res) {
    try {
      const { token } = req.params;
      const decoded = jwt.decode(token, secretOrkey);
      if (decoded) {
        const [rowsUpdated, [updatedAccount]] = await User.update(
          { isActivated: true },
          {
            where: { username: decoded.username },
            returning: true
          }
        );
        res.status(200).send({
          status: 200,
          accountsUpdated: rowsUpdated,
          isActivated: updatedAccount.dataValues.isActivated,
        });
      } else {
        throw new Error('Token is expired or invalid Token');
      }
    } catch (error) {
      res.status(400).send({
        status: 400,
        error: error.message
      });
    }
  }
}

export default LinkVerification;
