import Mailer from './mailer';

/**
 * Call mailer class to send email to the user
 * @param {string} userEmail - User email account for sending email to
 * @param {string} token - Token that added to email sent
 * @param {template} template email templates
 * @return {Promise} resolve or reject
 */
const sendEmail = (userEmail, token, template = 'verification') => new Promise(async (resolve, reject) => {
  try {
    const mailer = new Mailer(userEmail);
    const response = mailer.addTokenToEmail(token, template);
    resolve(response);
  } catch (error) {
    reject(new Error(`Email failed: ${error.message}`));
  }
});

export default sendEmail;
