import FacebookTokenStrategy from 'passport-facebook';
import dotenv from 'dotenv';
// import models from '../models/index';

// @dotenv configuration
dotenv.config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, APP_URL } = process.env;

const fbStrategy = new FacebookTokenStrategy(
  {
    callbackURL: `${APP_URL}api/users/login/facebook/redirect`,
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    const userFacebook = {
      email: profile._json.email,
      username: profile._json.name,
      isActivated: true
    };
    done(null, userFacebook);
  }
);

export default fbStrategy;
