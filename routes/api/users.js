import express from 'express';
// @controller
import User from '../../controllers/user';
// @middleware
import check from '../../middlewares/user';
import VerifyLink from '../../controllers/email/verifyLink';
import validateUser from '../../helpers/validate';

const router = express.Router();

// @POST
// @description creating user
router.post('/', validateUser, check, User.signup);

router.post('/send-verification-link', VerifyLink.sendEmail);
router.get('/verify/:token', VerifyLink.activate);
router.post('/login', User.login);
router.post('/password', User.checkEmail);
router.put('/password', User.resetPassword);


export default router;
