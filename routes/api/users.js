import express from 'express';
import passport from 'passport';
// @controller
import User from '../../controllers/user';
import Follow from '../../controllers/followers';
// @middleware
import check from '../../middlewares/user';
import { checkFollowedBy, checkUserId } from '../../middlewares/followers';
import VerifyLink from '../../controllers/email/verifyLink';
import validateUser from '../../helpers/validate';
import multer from '../../middlewares/multerConfiguration';
import { passwordValidation } from '../../middlewares/passwordValidate';


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
router.post('/follow/:userId', auth, checkUserId, checkFollowedBy, Follow.follow);
// @method DELETE
// @desc Unfollow user
// @access private
router.delete('/unfollow/:userId', auth, checkUserId, Follow.unfollow);
//@method GET
//@desc get followers of users
//@access private
router.get("/followers", auth,  Follow.followers);
//@method GET
//@desc get following user
//@access private
router.get("/following", auth,  Follow.following);

export default router;
