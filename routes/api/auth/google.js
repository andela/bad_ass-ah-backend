/* eslint-disable no-unused-vars */
import passport from 'passport';
import express from 'express';
import authentication from '../../../middlewares/authentication';
import User from '../../../controllers/user';

const GoogleStrategy = new authentication();

const user = new User();
const router = express.Router();


router.get('/login/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/login/google/redirect', passport.authenticate('google', { session: false }), user.loginViaSocialMedia);

export default router;
