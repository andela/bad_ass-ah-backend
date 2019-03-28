import nodemailer from 'nodemailer';
import { email } from '../../config/config';
import emailTemplates from './emailTemplates';

/**
 * Class module to send email
 * @exports
 * @class
 */
class Mailer {
  /**
   * Initialize user and pass
   * @constructor
   * @param {string} _userEmail - User email
   */
  constructor(_userEmail) {
    this.userEmail = _userEmail;
    this.senderEmail = email.user;
    this.senderPass = email.pass;
  }

  /**
   * Add button link to the verification email template
   * @param {string} token - token
   * @returns {Promise} resolved or reject
   */
  addTokenToEmail(token) {
    return new Promise(async (resolve, reject) => {
      const mailOptions = emailTemplates.verification;
      mailOptions.from = this.senderEmail;
      mailOptions.to = this.userEmail;
      const addToken = mailOptions.html.replace('$', token);
      mailOptions.html = addToken;
      try {
        const response = await this.sendEmail(mailOptions);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send email
   * @param {Object} mailOptions - Email template
   * @return {Promise} resolve or reject
   */
  sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.senderEmail,
          pass: this.senderPass
        }
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(`Email sent: ${info.response}`);
        }
      });
    });
  }
}

export default Mailer;
