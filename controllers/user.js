import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import models from '../models/index';
import sendEmail from '../helpers/sendEmail/callMailer';
import generateToken from '../helpers/token';

dotenv.config();
const User = models.user;
const secretKey = process.env.secretOrKey;
const expirationTime = {
  expiresIn: '50day'
};
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
  async signup(req, res) {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    try {
      const { dataValues: user } = await User.create(newUser);
      const payload = { id: user.id, username: user.username, email: user.email };
      const token = jwt.sign(payload, secretKey, expirationTime);
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
      return res.status(500).json({
        error: error.message
      });
    }
  }

  /**
   * user login
   * @param {Object} req -requestesting from user
   * @param {Object} res -responding from user
   * @returns {Object} Response with status of 201
   */
  login(req, res) {
    const user = {
      email: req.body.email,
      password: req.body.password
    };
    return User.findOne({ where: { email: user.email } })
      .then((foundUser) => {
        if (foundUser && bcrypt.compareSync(user.password, foundUser.password)) {
          const payload = {
            id: foundUser.id,
            email: foundUser.email,
          };
          const token = jwt.sign(payload, secretKey, expirationTime);
          res.status(200).json({
            status: 200,
            token,
            user: payload
          });
        } else {
          res.status(400).json({ status: 400, error: 'Incorrect username or password' });
        }
      }).catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }

  /**
   * Login User via google.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response after registering the user.
   */
  googleLogin(req, res) {
    const user = {
      username: req.user.username,
      email: req.user.email,
    };
    const payload = {
      id: req.user.id,
      email: req.user.email
    };
    // @creating jwt token
    const token = jwt.sign(payload, secretKey, expirationTime);
    return res.status(200).json({ status: 200, token: `${token}`, user });
  }

  /**
   * @param {Object} req -requesting from user
   * @param {Object} res - responding from user
   * @returns {Object} Response with json data
   */
  socialLogin(req, res) {
    const payload = {
      id: req.user.id,
      email: req.user.email
    };
    const {
      generate
    } = generateToken(payload);
    return res.status(200).json({ status: 200, user: `welcome: ${req.user.username}`, token: generate });
  }

  /**
   * Checks if the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */
  checkEmail(req, res) {
    const user = {
      email: req.body.email,
    };
    return User.findOne({
      where: {
        email: user.email
      }
    })
      .then(async (foundUser) => {
        if (foundUser) {
          const payload = {
            email: foundUser.email,
          };
          const token = jwt.sign(payload, secretKey, expirationTime);
          req.body.token = token;
          req.body.template = 'resetPassword';
          const response = await sendEmail(user.email, token, 'resetPassword');
          res.status(200).send({ status: 200, response });
        } else {
          res.status(404).json({ status: 404, error: 'This email is not in our database' });
        }
      }).catch((error) => { res.status(500).json({ error }); });
  }

  /**
   * Resets password.
   * @param {object} req request.
   * @param {object} res response.
   * @returns {object} response.
   */
  async resetPassword(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    const {
      token
    } = req.body;
    const decoded = jwt.decode(token, secretKey);
    try {
      if (decoded) {
        const checkUpdate = await User.update({
          password,
        }, {
          where: {
            email: decoded.email
          }
        });
        if (checkUpdate.length >= 1) {
          return res.status(200).json({ message: 'Congratulations! Your password was reset', });
        }
      }
      return res.status(401).json({ error: 'Invalid token' });
    } catch (error) {
      res.status(400).send({ status: 400, error: error.message });
    }
  }

  /**
 * Get all users.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response.
 */
  getAllUsers(req, res) {
    User.findAll({ attributes: ['username', 'email', 'bio', 'image'] })
      .then((users) => {
        res.status(200).json({ status: 200, users });
      }).catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }
}

export default new UserController();
