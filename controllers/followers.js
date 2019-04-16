import models from '../models/index';

const Follower = models.follower;
const User = models.user;
/**
  * @param {class} --Followers controller
  */
class FollowerController {
  /**
     *
     * @param {Object} req
     * @param {Object} res
     * @return {Object} message
     */
  static follow(req, res) {
    const followUser = { userId: req.params.userId, followedBy: req.user.id };
    Follower.create(followUser)
      .then(() => res.status(201).json({ status: 201, message: ` Thank you for following ${req.followedBy}.` }));
  }

  /**
     *
     * @param {Object} req
     * @param {Object} res
     * @return {Object} message
     */
  static unfollow(req, res) {
    Follower.destroy({ where: { userId: req.params.userId, followedBy: req.user.id } })
      .then(() => res.status(200).json({ status: 200, message: ' unfollowed successfully.' }));
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res getting followers
   * @returns {Object} followers and number of followers
   */
  static followers(req, res) {
    Follower.findAll({
      where: { userId: req.user.id },
      include: [{
        model: User,
        as: 'followedFkey',
        attributes: ['username', 'email', 'image']
      }]
    })
      .then((followers) => {
        const number = [];
        for (let i = 0; i < followers.length; i++) {
          number.push(followers[i].followedFkey.length);
        }
        return res.status(200).json({ status: 200, numberOfFollowers: number.length, followers });
      })
      .catch(error => res.status(500).json({ error }));
  }

  /**
 *
 * @param {Object} req
 * @param {Object} res
 *  @return {Object} following people and number of following
 */
  static following(req, res) {
    Follower.findAll({
      where: { followedBy: req.user.id },
      include: [{
        model: User,
        as: 'userFkey',
        attributes: ['username', 'email', 'image']
      }]
    })
      .then((following) => {
        const number = [];
        for (let i = 0; i < following.length; i++) {
          number.push(following[i].userFkey.length);
        }
        return res.status(200).json({ status: 200, numberOfFollowing: number.length, following });
      })
      .catch(error => res.status(500).json({ error }));
  }
}
export default FollowerController;
