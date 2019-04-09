import express from 'express';
import passport from 'passport';
// @controller
import User from '../../controllers/user';
// @middleware
import check from '../../middlewares/user';
import VerifyLink from '../../controllers/email/verifyLink';
import validateUser from '../../helpers/validate';
import multer from '../../middlewares/multerConfiguration';


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
router.put('/password', User.resetPassword);

router.post('/login/google', passport.authenticate('googleToken', { session: false }), User.googleLogin);

router.get('/:id/profile', auth, User.getProfile);
router.put('/profile', auth, multer, User.updateProfile);

export default router;
