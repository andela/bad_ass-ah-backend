import dotenv from 'dotenv';
import models from '../models/index';
import Check from '../helpers/notifications/check';
import Templates from '../helpers/sendEmail/emailTemplates';
import Mailer from '../helpers/sendEmail/mailer';

dotenv.config();
const { notificationTemplate } = Templates;

const Notification = models.notification;
const User = models.user;

const mailOptions = {
  // eslint-disable-next-line arrow-body-style
  to: '',
  from: process.env.SENDER_EMAIL,
  subject: 'Notification',
  html: ''
};

/**
 * @notification controller
 * @exports
 * @class
 */
class NotificationController {
  /**
   * Create app notifications
   * @param {Integer} articleId id of the article
   * @param {Text} message -body of notification
   * @param {Integer} notifier -notifier id
   * @returns {Object} Create notifications
   */
  async createNotificationForFavorite(articleId, message, notifier) {
    try {
      let notifications = [];
      const usersWhoFavoritedArticle = await Check.checkWhoFavoritesArticle(articleId);
      if (usersWhoFavoritedArticle.length > 0) {
        // eslint-disable-next-line array-callback-return
        usersWhoFavoritedArticle.map((user) => {
          const { id } = user.userfkey.dataValues;
          if (id !== notifier) {
            const notification = { userId: id, message };
            notifications.push(notification);
          }
        });
        if (notifications.length > 0) {
          notifications = Object.values(notifications
            .reduce((acc, cur) => Object.assign(acc, { [cur.userId]: cur }), {}));
          const createdNotifications = await Notification
            .bulkCreate(notifications, { returning: true });
          return createdNotifications;
        }
      }
    } catch (error) {
      return error;
    }
  }

  /**
   * Create app notifications
   * @param {Integer} folloewerId id of the article
   * @param {Text} message -body of notification
   * @param {Integer} notifier -notifier id
   * @returns {Object} Create notifications
   */
  async createNotificationForFollower(folloewerId, message) {
    try {
      const notifications = [];
      const notification = { userId: '', message: '' };
      const followers = await Check.checkFollowers(folloewerId);
      if (followers.length > 0) {
        // eslint-disable-next-line array-callback-return
        followers.map((follower) => {
          const { id } = follower.followedFkey.dataValues;
          notification.userId = id;
          notification.message = message;
          notifications.push(notification);
        });
        const createdNotifications = await Notification
          .bulkCreate(notifications, { returning: true });
        return createdNotifications;
      }
    } catch (error) {
      return error;
    }
  }


  /**
   * Send email notifications
   * @param {Integer} articleId id of the article
   * @param {Text} message notification body
   * @param {Integer} notifier -notifier id
   * @returns {Object} send notifications
   */
  async sendNotificationToFavorites(articleId, message, notifier) {
    const emails = new Set();
    const usersWhoFavoritedArticle = await Check.checkWhoFavoritesArticle(articleId);
    if (usersWhoFavoritedArticle.length > 0) {
      // eslint-disable-next-line array-callback-return
      usersWhoFavoritedArticle.map((user) => {
        const { id, email, allowNotifications } = user.userfkey.dataValues;
        if (allowNotifications === true && id !== notifier) {
          emails.add(email);
        }
      });

      if (emails.size > 0) {
        mailOptions.to = [...emails];
        mailOptions.html = notificationTemplate(message);
        const mailer = new Mailer();
        const sendEmail = mailer.sendEmail(mailOptions);
        return sendEmail;
      }
    }
  }

  /**
   * Send email notifications
   * @param {Integer} followerId id of the article
   * @param {Text} message notification body
   * @param {Integer} notifier -notifier id
   * @returns {Object} send notifications
   */
  async sendNotificationToFollower(followerId, message) {
    const emails = new Set();
    const followers = await Check.checkFollowers(followerId);
    if (followers.length > 0) {
      // eslint-disable-next-line array-callback-return
      followers.map((user) => {
        const { email, allowNotifications } = user.followedFkey.dataValues;
        if (allowNotifications === true) {
          emails.add(email);
        }
      });
      mailOptions.to = [...emails];
      mailOptions.html = notificationTemplate(message);
      if (emails.size > 0) {
        const mailer = new Mailer();
        const sendEmail = mailer.sendEmail(mailOptions);
        return sendEmail;
      }
    }
  }

  /**
   * Get all notifications
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} result
   */
  async getAllNotifications(req, res) {
    try {
      const notifications = await Notification.findAll({
        where: { userId: req.user.id, status: 'unread' },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json({ status: 200, notifications });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get a single notification
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} result
   */
  async getSingleNotification(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const notification = await Notification.findOne({
        where: { id, userId: req.user.id, status: 'unread' },
      });
      if (!notification) {
        return res.status(404).json({ status: 404, error: 'Notification not found' });
      }
      const updatedNotification = await Notification.update(
        { status: 'read' },
        { where: { id: notification.id }, returning: true }
      );
      res.status(200).json({ status: 200, notification: updatedNotification });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get a single notification
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} result
   */
  async deleteNotification(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const notification = await Notification.destroy({
        where: { id },
        returning: true
      });
      if (!notification) {
        return res.status(404).json({ status: 404, error: 'Notification not found' });
      }
      res.status(200).json({ status: 200, message: 'Notification successfully deleted.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * subscription
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} result
   */
  async subscribe(req, res) {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    let allow;
    if (user.allowNotifications === true) {
      allow = false;
    } else {
      allow = true;
    }
    const updatedUser = await User.update(
      { allowNotifications: allow },
      { where: { id }, returning: true, plain: true }
    );
    const newUser = {
      username: updatedUser[1].username,
      email: updatedUser[1].email,
      bio: updatedUser[1].bio,
      image: updatedUser[1].image,
      allowNotifications: updatedUser[1].allowNotifications
    };
    res.status(200).json({ status: 200, user: newUser });
  }
}

export default NotificationController;
