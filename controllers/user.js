import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import models from '../models/index';
import sendEmail from '../helpers/sendEmail/callMailer';
import generateToken from '../helpers/token';
import Validate from '../helpers/validateUser';
import { activation, Access } from '../helpers/activation';

dotenv.config();
const User = models.user;
const { FRONT_END_URL } = process.env;
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
      password: bcrypt.hashSync(req.body.password, 10),
      isAdmin: req.body.isAdmin ? req.body.isAdmin : false,
      isManager: req.body.isManager ? req.body.isManager : false,
      isActivated: req.body.isAdmin === true
    };
    try {
      const { dataValues: user } = await User.create(newUser);
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      };
      const token = jwt.sign(payload, secretKey, expirationTime);
      const response = await sendEmail(user.email, token);
      const registeredUser = {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        emailResponse: response
      };
      if (process.env.NODE_ENV === 'test') registeredUser.token = token;
      return res.status(201).json({ registeredUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * user login
   * @param {Object} req -requesting from user
   * @param {Object} res -responding from user
   * @returns {Object} Response with status of 201
   */
  login(req, res) {
    const user = { email: req.body.email, password: req.body.password };
    return User.findOne({ where: { email: user.email } })
      .then((foundUser) => {
        if (foundUser && bcrypt.compareSync(user.password, foundUser.password)) {
          if (foundUser.isActivated === false) {
            return res
              .status(403)
              .send({ status: 403, error: 'Verify your email account before login.' });
          }
          const payload = {
            id: foundUser.id,
            email: foundUser.email,
            isAdmin: foundUser.isAdmin
          };
          const token = jwt.sign(payload, secretKey, expirationTime);
          res.status(200).json({ status: 200, token, user: payload });
        } else {
          res.status(400).json({ status: 400, error: 'Incorrect username or password' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }

  /**
   *
   * @param {Object} req
   * @param {*} res
   * @returns {Object} Json data
   */
  async loginViaSocialMedia(req, res) {
    const socialMediaUser = {
      username: req.user.username,
      isActivated: true
    };
    const result = await User.findOrCreate({
      where: {
        username: socialMediaUser.username
      },
      defaults: socialMediaUser
    });
    const payload = {
      id: result[0].id
    };
    const { generate } = generateToken(payload);
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      return res.redirect(`${FRONT_END_URL}/login?token=${generate}&status=ok&username=${socialMediaUser.username}$`);
    }
    return result;
  }

  /**
   * Checks if the email exists.
   * @param {object} req request
   * @param {object} res response.
   * @returns {object} response.
   */
  checkEmail(req, res) {
    const user = {
      email: req.body.email
    };
    return User.findOne({
      where: {
        email: user.email
      }
    })
      .then(async (foundUser) => {
        if (foundUser) {
          const payload = {
            email: foundUser.email
          };
          const token = jwt.sign(payload, secretKey, expirationTime);
          req.body.token = token;
          req.body.template = 'resetPassword';
          const response = await sendEmail(user.email, token, 'resetPassword');
          res.status(200).send({ status: 200, response });
        } else {
          res.status(404).json({ status: 404, error: 'This email is not in our database' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  }

  /**
   * Resets password.
   * @param {object} req request.
   * @param {object} res response.
   * @returns {object} response.
   */
  async resetPassword(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    const { token } = req.body;
    const decoded = jwt.decode(token, secretKey);
    try {
      if (decoded) {
        const checkUpdate = await User.update(
          {
            password
          },
          {
            where: {
              email: decoded.email
            }
          }
        );
        if (checkUpdate.length >= 1) {
          return res.status(200).json({ message: 'Congratulations! Your password was reset' });
        }
      }
      return res.status(401).json({ error: 'Invalid token' });
    } catch (error) {
      res.status(500).send({ status: 500, error: error.message });
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
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }

  /**
   * Get User Profile.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object.
   */
  getUserProfile(req, res) {
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
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }

  /**
   * Update User Profile.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object.
   */
  async updateUserProfile(req, res) {
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

  /**
   *
   * @param {req} req
   * @param {res} res
   * @return {Object} ruturn object
   */
  async givePermission(req, res) {
    const find = await User.findOne({ where: { id: req.params.userId } });
    if (find.isAdmin === true) {
      Access(req, res, false, find.id);
    } else {
      Access(req, res, true, find.id);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @return {Object} ruturn object
   */
  async enableOrDisableUser(req, res) {
    if (req.userInfo.isAdmin === true || req.userInfo.isManager === true) {
      return res.status(403).json({
        status: 403,
        message: `Permission denied, You are not allowed to unable/disable  ${
          req.userInfo.username
        }`
      });
    }
    try {
      const find = await User.findOne({ where: { id: req.params.userId } });
      // @check user status
      if (find.status === true) {
        await activation(req, res, 'disabled', false, find.id);
      } else {
        await activation(req, res, 'enabled', true, find.id);
      }
    } catch (error) {
      return res.status(500).json({ error: 'something please try again.' });
    }
  }
}

export default UserController;
