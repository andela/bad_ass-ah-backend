import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import models from '../models/index';

dotenv.config();
const { secretOrKey } = process.env;
const User = models.user;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

const auth = (passport) => {
  passport.use(new JwtStrategy(opts, (jwtpayload, done) => {
    User.findOne({ where: { id: jwtpayload.id } })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        // @when our user is available
        return done(null, user);
      })
      .catch(error => done(null, false, error));
  }));
};

export default auth;
