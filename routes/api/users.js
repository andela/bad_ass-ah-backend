import express from 'express';
import passport from 'passport';
// @controller
import User from '../../controllers/user';
import Follow from '../../controllers/followers';
import Notification from '../../controllers/notification';
// @middleware
import check from '../../middlewares/user';
import { checkFollowedBy, checkUserId } from '../../middlewares/followers';
import VerifyLink from '../../controllers/email/verifyLink';
import validateUser from '../../helpers/validate';
import multer from '../../middlewares/multerConfiguration';
import { passwordValidation } from '../../middlewares/passwordValidate';
import articleStats from '../../controllers/stats/articleStats';
import asyncHandler from '../../helpers/errors/asyncHandler';
import activate from '../../middlewares/userAccount';


const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// @POST
// @description creating user
router.post('/', validateUser, check, User.signup);
router.get('/', auth, User.getAllUsers);

router.post('/send-verification-link', VerifyLink.sendEmail);
router.get('/verify/:token', VerifyLink.activate);
router.post('/login', User.login);

router.post('/password', User.checkEmail);
router.put('/password', passwordValidation, User.resetPassword);

router.post('/login/google', passport.authenticate('googleToken', { session: false }), User.googleLogin);

router.get('/:id/profile', auth, User.getProfile);
router.put('/profile', auth, multer, User.updateProfile);

// @followers
// @method POST
// @desc follow user
// @access private
router.post('/follow/:userId', auth, asyncHandler(activate.isUserAccountActivated),
  asyncHandler(checkUserId), checkFollowedBy, Follow.follow);
// @method DELETE
// @desc Unfollow user
// @access private
router.delete('/unfollow/:userId', auth, asyncHandler(activate.isUserAccountActivated),
  asyncHandler(checkUserId), Follow.unfollow);
// @method GET
// @desc get followers of users
// @access private
router.get('/followers', auth, asyncHandler(activate.isUserAccountActivated), Follow.followers);
// @method GET
// @desc get following user
// @access private
router.get('/following', auth, asyncHandler(activate.isUserAccountActivated), Follow.following);
router.get('/reading-stats', auth, asyncHandler(articleStats.getUserReadingStats));
// Notifications
router.get('/notifications/subscribe', auth, Notification.subscribe);
router.get('/notifications', auth, Notification.getAll);
router.get('/notifications/:id', auth, Notification.getOne);
router.delete('/notifications/:id', auth, Notification.delete);

export default router;
