import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import models from '../models/index';
import sendEmail from '../helpers/sendEmail/callMailer';
import generateToken from '../helpers/token';
import Validate from '../helpers/validateUser';

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
      const payload = {
        id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin
      };
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
      return res.status(500).json({ error: error.message });
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
            isAdmin: foundUser.isAdmin
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
   *
   * @param {Object} req
   * @param {*} res
   * @returns {Object} Json data
   */
  async twitterLogin(req, res) {
    const twitterUser = {
      username: req.user.username
    };
    const result = await User.findOrCreate({
      where: {
        username: twitterUser.username
      },
      defaults: twitterUser
    });
    const { generate } = generateToken(twitterUser);
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      return res.status(200).json({ status: 200, Welcome: twitterUser.username, token: generate });
    } return result;
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

  /**
 * Get User Profile.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */
  getProfile(req, res) {
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({ status: 400, error: 'The User ID must be an integer' });
    }
    const id = parseInt(req.params.id, 10);
    return User.findOne({ where: { id, isActivated: true } })
      .then((user) => {
        if (!user) {
          res.status(404).json({ status: 404, error: 'User not found' });
        } else {
          const profile = {
            username: user.username,
            email: user.email,
            bio: user.bio,
            image: user.image
          };

          res.status(200).json({ status: 200, profile });
        }
      }).catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }

  /**
 * Update User Profile.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 */
  async updateProfile(req, res) {
    try {
      const { id } = req.user;
      if (Validate.isEmpty(req.body.username)) {
        return res.status(400).json({ status: 400, error: 'Please provide a username' });
      }
      const updatedUser = await User.update(
        {
          username: req.body.username,
          bio: req.body.bio,
          image: req.file ? req.file.url : null
        },
        { where: { id }, returning: true, plain: true }
      );
      const newProfile = {
        username: updatedUser[1].username,
        email: updatedUser[1].email,
        image: updatedUser[1].image,
        bio: updatedUser[1].bio
      };
      res.status(200).json({ status: 200, profile: newProfile });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();
