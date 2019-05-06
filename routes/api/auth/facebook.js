import passport from 'passport';
import express from 'express';
import User from '../../../controllers/user';

const user = new User();
const router = express.Router();

router.post('/facebook', passport.authenticate('facebookToken', { session: false }), user.loginViaFacebook);

export default router;
