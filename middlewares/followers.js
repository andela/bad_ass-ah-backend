import Sequelize from 'sequelize';
import models from '../models/index';

const Follower = models.follower;
const User = models.user;
const { and } = Sequelize;
export const checkFollowedBy = async (req, res, next) => {
  // @check if user id is equal to followUser.userId
  if (Number(req.user.id) === Number(req.params.userId)) {
    return res.status(403).json({ status: 403, error: 'Permission denied, you can`t follow yourself' });
  }
  await Follower.findOne({ where: and({ followedBy: req.user.id }, { userId: req.params.userId }) })
    .then((user) => {
      if (user) {
        return res.status(409).json({ status: 409, error: 'You already followed this user.' });
      }
      next();
    })
    .catch(error => res.status(500).json({ status: 500, error }));
};

export const checkUserId = async (req, res, next) => {
  await User.findByPk(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ status: 404, error: 'sorry user not found.' });
      }
      req.followedBy = user.username;
      next();
    })
    .catch(error => res.status(500).json({ status: 500, error }));
};
