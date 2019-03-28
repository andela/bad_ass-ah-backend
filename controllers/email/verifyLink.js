import jwt from 'jsonwebtoken';
import models from '../../models/index';
import { secretOrkey } from '../../config/config';
import Mailer from '../../helpers/sendEmail/mailer';

const User = models.user;

/**
 * Control email verification
 * @exports
 * @class
 */
class VerifyLink {
  /**
   * Send the verification email to a user
   * @param {Object} req - Requests from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  static async sendEmail(req, res) {
    const { token } = req.body;
    const decoded = jwt.decode(token, secretOrkey);
    try {
      if (decoded) {
        const mailer = new Mailer(decoded.email);
        const response = await mailer.verifyEmail(token);
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
        error: error.body
      });
    }
  }

  /**
   * Send verification email to the user
   * @param {Object} req - Requests from user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  static async activate(req, res) {
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

export default VerifyLink;
