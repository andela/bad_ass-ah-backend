import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import models from '../models/index';

dotenv.config();
const User = models.user;
/**
 * @user controller
 */
class UserController {
  /**
   * @methods
   */
  signup(req, res) {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    User.create(newUser)
      .then((user) => {
        const payload = {
          id: user.id,
          name: user.name
        };
        // @creating jwt token
        jwt.sign(payload, process.env.secretOrKey, { expiresIn: '1day' }, (tokenError, token) => {
          if (tokenError) {
            return res.status(500).json({ tokenError });
          }
          return res.status(200).json({ token: `Bearer ${token}`, user });
        });
      })
      .catch(error => res.status(500).json({ error }));
  }
}

export default new UserController();

