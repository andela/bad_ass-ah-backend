import { Router } from 'express';
import check from '../../middlewares/user';
import user from '../../controllers/user';
import VerifyLink from '../../controllers/email/verifyLink';

const router = Router();

// @POST
// @description creating user
router.post('/', check, user.signup);
router.post('/send-verification-link', VerifyLink.sendEmail);
router.get('/verify/:token', VerifyLink.activate);

export default router;
