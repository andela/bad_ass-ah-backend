import express from 'express';
// @controller
import User from '../../controllers/user';
// @middleware
import check from '../../middlewares/user';
import VerifyLink from '../../controllers/email/verifyLink';

const router = express.Router();

// @POST
// @description creating user
router.post('/', check, User.signup);

router.post('/send-verification-link', VerifyLink.sendEmail);
router.get('/verify/:token', VerifyLink.activate);
router.post('/login', User.login);


export default router;
