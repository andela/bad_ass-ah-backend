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
<a style="background-color: #61a46e; padding: 12px 15px 12px 15px; color: #eee; font-size: 16px; text-decoration: none; margin-left: 20px; cursor: pointer;" href="http://127.0.0.1:3000/api/users/verify/$">Activate account</a>`
  }
};

export default emailTemplates;
