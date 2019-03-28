import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import models from '../models/index';
import sendEmail from '../helpers/sendEmail/callMailer';

dotenv.config();
const User = models.user;
/**
 * @user controller
 * @exports
 * @class
 */
class UserController {
  /**
   * Sign up a new user
   * @param {Object} req - Requests from a user
   * @param {Object} res - Response to the user
   * @returns {Object} Response
   */
  static async signup(req, res) {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    try {
      const { dataValues: user } = await User.create(newUser);
      const payload = { id: user.id, username: user.username, email: user.email };
      const token = jwt.sign(payload, process.env.secretOrKey, { expiresIn: '1day' });
      const response = await sendEmail(user.email, token);
      return res.status(201).json({
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image,
        emailResponse: response
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
