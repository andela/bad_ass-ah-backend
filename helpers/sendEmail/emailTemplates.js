import dotenv from 'dotenv';

dotenv.config();
const url = (process.env.NODE_ENV === 'production') ? 'https://badass-ah-backend-staging.herokuapp.com' : `http://127.0.0.1:${process.env.LOCALHOST_PORT}`;

/**
 * An object module that holds mails' templates
 * @exports email/templates
 */
const emailTemplates = {
  verification: {
    from: '',
    to: '',
    subject: 'Email Verification',
    html: `<h1 style="color: #444; margin-left: 20px;">Welcome to Author's Haven</h1>
<p style="color: #555; margin-left: 20px; font-size: 14px">Thank you for signing to the Author's Haven. Please click on the button below to activate your account.</p><br>
<a style="background-color: #61a46e; padding: 12px 15px 12px 15px; color: #eee; font-size: 16px; text-decoration: none; margin-left: 20px; cursor: pointer;" href="${url}/api/users/verify/$token">Activate account</a>`
  },

  resetPassword: {
    from: '',
    to: '',
    subject: 'Password Reset',
    html: `<h1 style="color: #444; margin-left: 20px;">Password reset</h1>
<p style="color: #555; margin-left: 20px; font-size: 14px">Lost your password? click on the link below to reset your password.</p><br>
<a style="background-color: #61a46e; padding: 12px 15px 12px 15px; color: #eee; font-size: 16px; text-decoration: none; margin-left: 20px; cursor: pointer;" href="${url}/api/users/password/$token">Reset Password</a>`
  }
};

// eslint-disable-next-line arrow-body-style
const notificationTemplate = (message) => {
  return `<h1 style="color: #444; margin-left: 20px;">Updates on article you favorite</h1>
<p style="color: #555; margin-left: 20px; font-size: 14px">${message}</p><br>`;
};

export default { emailTemplates, notificationTemplate };
