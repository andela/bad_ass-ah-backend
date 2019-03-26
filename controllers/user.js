import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import models from '../models/index';

dotenv.config();
const User = models.user;
/**
  * @param {class} --UserController
  */
class UserController {
  /**
   *
   * @param {Object} req -requestesting from user
   * @param {Object} res -responding from user
   * @returns {Object} Response with status of 201
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
          name: user.username
        };
        // @creating jwt token
        const token = jwt.sign(payload, process.env.secretOrKey, { expiresIn: '1day' });
        return res.status(201).json({ status: 201, token: `Bearer ${token}`, user });
      })
      .catch(error => res.status(500).json({ error }));
  }
}

export default new UserController();
