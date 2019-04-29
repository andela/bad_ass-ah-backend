import GoogleStrategy from 'passport-google-plus-token';
import dotenv from 'dotenv';
import models from '../models/index';

dotenv.config();
const User = models.user;
const google = (passport) => {
  passport.use('googleToken', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const currentUser = await User.findOne({ where: { email: profile.emails[0].value } });
      if (currentUser) {
        done(null, currentUser);
      } else {
        const newUser = await User.create({
          username: profile.emails[0].value,
          email: profile.emails[0].value,
          isActivated: true
        });
        done(null, newUser);
      }
    } catch (error) {
      done(null, false, error);
    }
  }));
};

export default google;
