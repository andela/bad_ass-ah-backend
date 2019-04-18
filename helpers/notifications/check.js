import models from '../../models/index';

const Comment = models.comments;
const User = models.user;
const Vote = models.vote;
const Follower = models.follower;
/**
 * Check user who favorited an article or a comment
 * @exports
 * @class
 */
class Check {
  /**
   * Check all users who favorited an article
   * @param {Integer} id
   * @return {Object} all comments
   */
  async checkWhoFavoritesArticle(id) {
    try {
      const comments = await Comment.findAll({
        where: { articleId: id },
        include: [
          { model: User, as: 'userfkey', attributes: ['id', 'username', 'email', 'allowNotifications'] }
        ]
      });
      const votes = await Vote.findAll({
        where: { article: id },
        attributes: ['article'],
        include: [
          { model: User, as: 'userfkey', attributes: ['id', 'username', 'email', 'allowNotifications'] }
        ]
      });
      return [...comments, ...votes];
    } catch (error) {
      return error.message;
    }
  }

  /**
   * Check all users who follow a user
   * @param {Integer} id
   * @return {Object} all followers
   */
  async checkFollowers(id) {
    try {
      const followers = await Follower.findAll({
        where: { userId: id },
        attributes: ['userId', 'followedBy'],
        include: [
          { model: User, as: 'followedFkey', attributes: ['id', 'username', 'email', 'allowNotifications'] }
        ]
      });
      return followers;
    } catch (error) {
      return error.message;
    }
  }
}

export default new Check();
