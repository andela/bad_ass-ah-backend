import express from 'express';
import passport from 'passport';
// @controller
import User from '../../controllers/user';
import Profile from '../../controllers/profile';
import Follower from '../../controllers/followers';
import Notification from '../../controllers/notification';
// @middleware
import {
  check, checkAdmin, checkManager, checkIfBothAreManagers
} from '../../middlewares/user';

import { checkFollowedBy, checkUserId } from '../../middlewares/followers';
import LinkVerification from '../../controllers/email/verifyLink';
import validateUser from '../../helpers/validate';
import uploadImage from '../../middlewares/multerConfiguration';
import { passwordValidation } from '../../middlewares/passwordValidate';
import ArticleStats from '../../controllers/stats/articleStats';
import asyncHandler from '../../helpers/errors/asyncHandler';
import activate from '../../middlewares/userAccount';

const follower = new Follower();
const notification = new Notification();
const user = new User();
const profile = new Profile();
const linkVerification = new LinkVerification();
const articleStats = new ArticleStats();

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// @POST
// @description creating user
router.post('/', validateUser, check, user.signup);
router.get('/', auth, checkAdmin, user.getAllUsers);

router.post('/send-verification-link', linkVerification.sendEmail);
router.get('/verify/:token', linkVerification.activateAccount);
router.post('/login', user.login);

router.post('/password', user.checkEmail);
router.put('/password', passwordValidation, user.resetPassword);

router.get('/:id/profile', auth, profile.getUserProfile);
router.get('/profile', auth, profile.getCurrentUserProfile);
router.put('/profile', auth, uploadImage, profile.updateUserProfile);

// @followers
// @method POST
// @desc follow user
// @access private
router.post(
  '/follow/:userId',
  auth,
  asyncHandler(activate.isUserAccountActivated),
  asyncHandler(checkUserId),
  checkFollowedBy,
  follower.followUser
);
// @method DELETE
// @desc Unfollow user
// @access private
router.delete(
  '/unfollow/:userId',
  auth,
  asyncHandler(activate.isUserAccountActivated),
  asyncHandler(checkUserId),
  follower.unfollowUser
);
// @method GET
// @desc get followers of users
// @access private
router.get(
  '/followers',
  auth,
  asyncHandler(activate.isUserAccountActivated),
  follower.getFollowers
);
// @method GET
// @desc get following user
// @access private
router.get(
  '/following',
  auth,
  asyncHandler(activate.isUserAccountActivated),
  follower.getFollowing
);
router.get('/reading-stats', auth, asyncHandler(articleStats.getUserReadingStats));
// Notifications
router.get('/notifications/subscribe', auth, notification.subscribe);
router.get('/notifications', auth, notification.getAllNotifications);
router.get('/notifications/:id', auth, notification.getSingleNotification);
router.delete('/notifications/:id', auth, notification.deleteNotification);

// @method PUT
// @desc access
// @access private only-manager
router.put(
  '/access/:userId',
  auth,
  asyncHandler(checkUserId),
  checkManager,
  checkIfBothAreManagers,
  user.givePermission
);
// @method PUT
// @desc enabling or disabling user
// @access private only-admin
router.put(
  '/availability/:userId',
  auth,
  asyncHandler(checkUserId),
  checkAdmin,
  user.enableOrDisableUser
);

// Get user articles
router.get('/articles', auth, profile.getArticles);

export default router;
