import FacebookTokenStrategy from 'passport-facebook-token';
import dotenv from 'dotenv';
import models from '../models/index';

// @dotenv configuration
dotenv.config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;
const User = models.user;

const fbStrategy = (passport) => {
  passport.use('facebookToken',
    new FacebookTokenStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      (accessToken, refreshToken, profile, done) => {
        const info = {
          email: profile._json.email,
          username: profile._json.name
        }; User.findOrCreate({ where: { email: info.email }, defaults: info })
          .then(([users, created]) => {
            if (!users) {
              const user = created;
              return done(null, user);
            }
            const user = users;
            return done(null, user);
          });
      }
    ));
};

export default fbStrategy;
