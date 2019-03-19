import passport from 'passport';
import express from 'express';
import user from '../../../controllers/user';

const router = express.Router();

router.post('/facebook', passport.authenticate('facebookToken', { session: false }), user.socialLogin);

export default router;
