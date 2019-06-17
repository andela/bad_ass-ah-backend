import dotenv from 'dotenv';
import models from '../models/index';
import Validate from '../helpers/validateUser';

dotenv.config();
const User = models.user;
const Article = models.article;
/**
 * @user controller
 * @exports
 * @class
 */
class ProfileController {
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
      const userInfo = {
        username: req.body.username,
        bio: req.body.bio
      };
      if (req.file) userInfo.image = req.file.url;
      const updatedUser = await User.update(userInfo, {
        where: { id },
        returning: true,
        plain: true
      });
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
   * Get User Profile.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object.
   */
  async getCurrentUserProfile(req, res) {
    try {
      const { id } = req.user;

      const user = await User.findOne({ where: { id } });
      const profile = {
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image,
        allowNotifications: user.allowNotifications
      };

      res.status(200).json({ status: 200, profile });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res  get all user articles
   * @returns {Object} return all user articles
   */
  getArticles(req, res) {
    const { id } = req.user;
    Article.findAll({
      where: { author: id }
    })
      .then(articles => res.status(200).json({
        status: 200,
        articles
      }))
      .catch(error => res.status(500).json({ error }));
  }
}

export default ProfileController;
