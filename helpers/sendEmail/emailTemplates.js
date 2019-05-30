/* eslint-disable arrow-body-style */
import dotenv from 'dotenv';

dotenv.config();
const url = (process.env.NODE_ENV === 'production') ? 'https://badass-ah-backend-staging.herokuapp.com' : `http://127.0.0.1:${process.env.LOCALHOST_PORT}`;
const clientUrl = (process.env.NODE_ENV === 'production') ? 'https://authorsheaven.herokuapp.com' : 'http://127.0.0.1:3000';
const clientVerifytUrl = (process.env.NODE_ENV === 'production') ? 'https://authorsheaven.herokuapp.com' : 'http://127.0.0.1:3000';

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
<a style="background-color: #61a46e; padding: 12px 15px 12px 15px; color: #eee; font-size: 16px; text-decoration: none; margin-left: 20px; cursor: pointer;" href="${clientVerifytUrl}/verify/$token">Activate account</a>`
  },

  resetPassword: {
    from: '',
    to: '',
    subject: 'Password Reset',
    html: `<h1 style="color: #444; margin-left: 20px;">Password reset</h1>
<p style="color: #555; margin-left: 20px; font-size: 14px">Lost your password? click on the link below to reset your password.</p><br>
<a style="background-color: #61a46e; padding: 12px 15px 12px 15px; color: #eee; font-size: 16px; text-decoration: none; margin-left: 20px; cursor: pointer;" href="${clientUrl}/reset-password/$token">Reset Password</a>`
  },
};
const shareArticleTemplate = (articleId) => {
  return `<h1 style="color: #444; margin-left: 20px;">Share an article</h1>
    <p style="color: #555; margin-left: 20px; font-size: 14px">${url}/${articleId}.</p><br><br>
<a style="background-color: #61a46e; padding: 12px 15px 12px 15px; color: #eee; font-size: 16px; text-decoration: none; margin-left: 20px; cursor: pointer;" href="${url}/${articleId}$">${url}/${articleId}</a>`;
};

const notificationTemplate = (message) => {
  return `<h1 style="color: #444; margin-left: 20px;">Updates on article you favorite</h1>
<p style="color: #555; margin-left: 20px; font-size: 14px">${message}</p><br>`;
};

export default { emailTemplates, notificationTemplate, shareArticleTemplate };
