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
  followUser(req, res) {
    const followUser = { userId: req.params.userId, followedBy: req.user.id };
    Follower.create(followUser)
      .then(() => res.status(201).json({ status: 201, message: ` Thank you for following ${req.userInfo.username}.` }));
  }

  /**
     *
     * @param {Object} req
     * @param {Object} res
     * @return {Object} message
     */
  unfollowUser(req, res) {
    Follower.destroy({ where: { userId: req.params.userId, followedBy: req.user.id } })
      .then(() => res.status(200).json({ status: 200, message: ' unfollowed successfully.' }));
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res getting followers
   * @returns {Object} followers and number of followers
   */
  getFollowers(req, res) {
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
        for (let i = 0; i < followers.length; i += 1) {
          number.push(followers[i].followedFkey.length);
        }
        return res.status(200).json({ status: 200, numberOfFollowers: number.length, followers });
      })
      .catch(error => res.status(500).json({ error: `something wrong try again. ${error.message}` }));
  }

  /**
 *
 * @param {Object} req
 * @param {Object} res
 *  @return {Object} following people and number of following
 */
  getFollowing(req, res) {
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
        for (let i = 0; i < following.length; i += 1) {
          number.push(following[i].userFkey.length);
        }
        return res.status(200).json({ status: 200, numberOfFollowing: number.length, following });
      })
      .catch(error => res.status(500).json({ error: `something wrong try again. ${error.message}` }));
  }
}
export default FollowerController;
