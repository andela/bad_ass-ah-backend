/* eslint-disable no-unused-vars */
import passport from 'passport';
import express from 'express';
import authentication from '../../../middlewares/authentication';
import user from '../../../controllers/user';

const TwitwerStrategy = new authentication();

const router = express.Router();

router.get('/login/twitter', passport.authenticate('twitter',));
router.get('/login/twitter/redirect', passport.authenticate('twitter', { session: false }), user.twitterLogin);

export default router;
