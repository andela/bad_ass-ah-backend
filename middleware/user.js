
// model
import models from '../models/index';

const User = models.user;
// @checkEmail
const checkEmail = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((email) => {
      if (email) {
        return res.status(400).json({ error: 'email is already exist.' });
      }
      next();
    })
    .catch(error => res.status(500).json({ error: `something wrong try again. ${error}` }));
};
// @check username
const checkUsername = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } })
    .then((username) => {
      if (username) {
        return res.status(400).json({ error: 'username is already exist.' });
      }
      next();
    })
    .catch(error => res.status(500).json({ error: `something wrong. ${error}` }));
};
// @export
export {
  checkEmail,
  checkUsername
};
