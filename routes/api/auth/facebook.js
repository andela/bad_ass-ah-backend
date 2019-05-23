/* eslint-disable no-unused-vars */
import passport from 'passport';
import express from 'express';
import User from '../../../controllers/user';
import authentication from '../../../middlewares/authentication';

const FacebookStrategy = new authentication();

const user = new User();
const router = express.Router();

router.get('/login/facebook', passport.authenticate('facebook'));
// router.get('/facebook/redirect', passport.authenticate('facebook', user.loginViaSocialMedia));

router.get(
  '/login/facebook/redirect',
  passport.authenticate('facebook', { session: false, failureRedirect: '/facebook' }),
  user.loginViaSocialMedia
);

export default router;
