import models from '../models/index';

const User = models.user;
const check = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((userEmail) => {
      if (userEmail) {
        return res.status(400).json({ status: 400, error: 'email is already exist.' });
      }
      User.findOne({ where: { username: req.body.username } })
        .then((username) => {
          if (username) {
            return res.status(400).json({ status: 400, error: 'username is already exist.' });
          }
          next();
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

export default check;
